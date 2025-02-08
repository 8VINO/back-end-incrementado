const Registro = require('../models/registro');
const Conta = require('../models/conta');
const cron = require('node-cron');

// Função para calcular o próximo pagamento com base no período
const calcularProximoPagamento = (dataBase, periodo) => {
    const novaData = new Date(dataBase);
    if (periodo === 'Semanal') {
        novaData.setDate(novaData.getDate() + 7);
    } else if (periodo === 'Mensal') {
        novaData.setMonth(novaData.getMonth() + 1);
    } else if (periodo === 'Anual') {
        novaData.setFullYear(novaData.getFullYear() + 1);
    }
    return ajustarParaUTC3ComUmDia(novaData);
};

// Função para ajustar a data para UTC-3 e adicionar um dia
const ajustarParaUTC3ComUmDia = (data) => {
    const dataAjustada = new Date(data);
    dataAjustada.setHours(0, 0, 0, 0); // Define para meia-noite
    dataAjustada.setDate(dataAjustada.getDate() +1 ); // Adiciona 1 dia
    dataAjustada.setTime(dataAjustada.getTime() - 3 * 60 * 60 * 1000); // Subtrai 3 horas para UTC-3
    return dataAjustada;
};


const agendarProcessamento = (registro) => {
    
    const { data, tipo, valor, titulo, categoria, subcategoria, idconta, recorrencia, periodoRecorrencia,id_registro} = registro
    let valorFloat = parseFloat(valor);
    if (isNaN(valorFloat)) {
        throw new Error('Valor inválido');
    }
    const cronExpression = `${data.getUTCMinutes()} ${data.getUTCHours()} ${data.getUTCDate()} ${data.getUTCMonth() + 1} *`
    
    cron.schedule(cronExpression, async () => {
        
        try {
            const registroAtual = await Registro.findByPk(id_registro);
            
            
            if (!registroAtual || registroAtual.processado) {
                console.log('Registro já processado ou não encontrado.');
                return;
            }
            const contaAtualizada = await Conta.findByPk(idconta);
            
            if (!contaAtualizada) {
                console.error('Conta não encontrada para processamento.');
                
                return;
            }
            
            contaAtualizada.saldo = parseFloat(contaAtualizada.saldo) || 0;
            contaAtualizada.renda = parseFloat(contaAtualizada.renda) || 0;
            contaAtualizada.gasto = parseFloat(contaAtualizada.gasto) || 0;

            // Atualizar saldo da conta
            if (tipo === 'entrada') {
                contaAtualizada.saldo += valorFloat;
                contaAtualizada.renda += valorFloat;
            } else if (tipo === 'saida') {
                contaAtualizada.saldo -= valorFloat;
                contaAtualizada.gasto += valorFloat;
            }

            await contaAtualizada.save();

            console.log(`Processado registro ID ${id_registro}: Saldo atualizado.`);
            
            // Marcar o registro como processado
            await registroAtual.update({
                processado: true,
                proximo_pagamento: recorrencia === 'sim' 
                ? calcularProximoPagamento(data, periodoRecorrencia) 
                : null, // Apenas para recorrentes
            });
            
            // Criar novo registro recorrente, se necessário
            if (recorrencia === 'sim') {
                const proximaDataPagamento = calcularProximoPagamento(data, periodoRecorrencia);

                const novoRegistro = await Registro.create({
                    tipo,
                    titulo,
                    valor: valorFloat,
                    categoria,
                    subcategoria,
                    data: proximaDataPagamento,
                    recorrencia,
                    periodoRecorrencia,
                    proximo_pagamento: calcularProximoPagamento(proximaDataPagamento, periodoRecorrencia),
                    idconta: idconta,
                    processado: false,
                });
                
                console.log(`Novo registro criado: ID ${novoRegistro.id_registro}, Próximo pagamento: ${novoRegistro.proximo_pagamento}`);
                
                agendarProcessamento(novoRegistro); // Reagendar para o próximo pagamento
            }
        } catch (error) {
            console.error('Erro durante o processamento:', error);
        }
    });
};



const processarPagamento = async (registro) => {
    const { data, tipo, valor, titulo, categoria, subcategoria, idconta, recorrencia, periodoRecorrencia,id_registro} = registro
   
    

const contaAtualizada = await Conta.findByPk(idconta);
const registroProcessado = await Registro.findByPk(id_registro)

if (!contaAtualizada) {
    
    console.error('Conta não encontrada para processamento.');
    return;
}

contaAtualizada.saldo = parseFloat(contaAtualizada.saldo) || 0;
contaAtualizada.renda = parseFloat(contaAtualizada.renda) || 0;
contaAtualizada.gasto = parseFloat(contaAtualizada.gasto) || 0;

// Atualizar saldo da conta
if (tipo === 'entrada') {
    contaAtualizada.saldo += valor;
    contaAtualizada.renda += valor;
} else if (tipo === 'saida') {
    contaAtualizada.saldo -= valor;
    contaAtualizada.gasto += valor;
}


await contaAtualizada.save();
if(registroProcessado){
    await registroProcessado.update({processado: true})
    
}

await registroProcessado.reload();




console.log(`Pagamento processado imediatamente: Saldo atualizado.`);

if (recorrencia === 'sim') {
    const proximaDataPagamento = calcularProximoPagamento(data, periodoRecorrencia);
    
    const novoRegistro = await Registro.create({
        tipo,
        titulo,
        valor,
        categoria,
        subcategoria,
        data: proximaDataPagamento,
        recorrencia,
        periodoRecorrencia,
        proximo_pagamento: calcularProximoPagamento(proximaDataPagamento, periodoRecorrencia),
        idconta: idconta,
        processado: false,
    });
    
    
    
    console.log(`Novo registro recorrente criado: ID ${novoRegistro.id_registro}, Próximo pagamento: ${novoRegistro.proximo_pagamento}`);
    
    
    if(novoRegistro.data<=dataHoje){
        novoRegistro.processado=true
        await novoRegistro.save();
        await processarPagamento(novoRegistro);
        
    }
    if (novoRegistro.processado==false){
        console.log(novoRegistro.idconta)
        agendarProcessamento(novoRegistro)
    }
}
};

exports.inserirRegistro = async (dadosRegistro, idConta) => {
    const conta = await Conta.findByPk(idConta);

    if (!conta) {
       
        return null; // retorna null se a conta não existir
    }

    const {
        tipo,
        titulo,
        valor,
        categoria,
        subcategoria,
        data,
        recorrencia,
        periodoRecorrencia,
    } = dadosRegistro;

    let valorFloat = parseFloat(valor);
    if (isNaN(valorFloat)) {
        throw new Error('Valor inválido');
    }

    const dataPagamento = ajustarParaUTC3ComUmDia(data);
    
    // Verifica se a data de cadastro é hoje e processa o pagamento imediatamente
    const ajusteHoje = ajustarParaUTC3ComUmDia(new Date());
    ajusteHoje.setDate(ajusteHoje.getDate() -1 );
    dataHoje=ajusteHoje
    
    if (recorrencia==='sim'){
        proximoPagamento = calcularProximoPagamento(dataPagamento, periodoRecorrencia);
    }
    else{
        proximoPagamento = null;
    }
    
    // Criar o registro inicial no banco de dados
    const registro = await Registro.create({
        tipo,
        titulo,
        valor: valorFloat,
        categoria,
        subcategoria,
        data: dataPagamento,
        recorrencia,
        periodoRecorrencia,
        proximo_pagamento: proximoPagamento, // Apenas se for recorrente
        idconta: conta.id_conta,
        processado: false, // Campo para controle de duplicação
    });
    
    
    console.log(`Registro inicial criado: ID ${registro.id_registro}, Próximo pagamento: ${proximoPagamento || 'N/A'}`);
    
    if (registro.data <= dataHoje) {
        let id_registro=registro.id_registro
        
        await processarPagamento(registro);
       
    }

    else{
        
        agendarProcessamento(registro);
    }

    return {
        mensagem: 'Registro inserido com sucesso! O pagamento será processado automaticamente na data de vencimento.',
        proximoPagamento: recorrencia === 'sim' ? proximoPagamento : null,
    };

    
    // Função para processar o pagamento imediatamente
    


};  
exports.buscarRegistroPorConta = (id) => {
    
    return Registro.findAll({
        where: {
            idconta: id
        }
    });
};

exports.atualizarRegistro = async (dadosRegistro,id) =>{
    const { data, tipo, valor, titulo, categoria, subcategoria, recorrencia, periodoRecorrencia} = dadosRegistro
    const registroAtual = await Registro.findByPk(id)
    const dataPagamento = ajustarParaUTC3ComUmDia(data);
    let valorFloat = parseFloat(valor);
    if (isNaN(valorFloat)) {
        throw new Error('Valor inválido');
    }

    if (recorrencia==='sim'){
        proximoPagamento = calcularProximoPagamento(dataPagamento, periodoRecorrencia);
    }
    else{
        proximoPagamento = null;
    }
    
    if(registroAtual && registroAtual.processado==false){
        await registroAtual.update({
            data: data,
            tipo: tipo,
            valor: valorFloat,
            titulo: titulo,
            categoria: categoria,
            subcategoria: subcategoria,
            recorrencia: recorrencia,
            periodoRecorrencia: periodoRecorrencia,
            proximo_pagamento: proximoPagamento
        })
    
   
        const ajusteHoje = ajustarParaUTC3ComUmDia(new Date());
        ajusteHoje.setDate(ajusteHoje.getDate() -1 );
        dataHoje=ajusteHoje
       
        if (registroAtual.data <= dataHoje) {
           
            await processarPagamento(registroAtual);
            
        }
    
        else{
            
            await agendarProcessamento(registroAtual);
        }
    
        return {
            mensagem: 'Registro atualizado com sucesso! O pagamento será processado automaticamente na data de vencimento.',
            proximoPagamento: recorrencia === 'sim' ? proximoPagamento : null,
        };
    }else{
        return null
    }
    
}

exports.deletarRegistro = async (id) =>{
    return Registro.findByPk(id)
    .then(registro=>{
        if (registro){
            return registro.destroy()
        }
        return null
    })
}