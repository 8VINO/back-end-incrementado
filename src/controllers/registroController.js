const registroService = require('../services/registroService');
const dayjs = require('dayjs'); //validar data

//Vai servir para a gente inserir o registro
exports.Insert = (req, res, next) => {
    const dadosRegistro = req.body;
    const idConta = req.params.id_conta; // ID da conta passada como parâmetro na URL
    
    


    // validar a data 
    const { data } = dadosRegistro;
    const hoje = dayjs().startOf('day'); // começa no início do dia de hoje
    
    // verifica se a data é válida
    if (!dayjs(data).isValid()) {
        return res.status(400).json({ menssagem: 'Data inválida!' });
    }

    // verifica se a data é antiga
    

    registroService.inserirRegistro(dadosRegistro, idConta)
        .then((registro) => {
            if(registro)
                res.status(201).json({
                    menssagem: 'Registro inserido com sucesso!',
                    data: registro,
                });
           else if(!registro){
                res.status(404).json({menssagem: 'Conta não encontrada! '})
            }
        })
        .catch((err) => {
            next(err); 
        });
};

//Busca todos os registros associado ao id da conta
exports.SearchAll = (req, res, next) => {
    const id_conta = req.params.id_conta;  
    registroService.buscarRegistroPorConta(id_conta)
        .then(registro => {
            if (registro) {
                res.status(200).send(registro);
            } else {
                res.status(404).json({menssagem: "Registro não encontrado."});
            }
        })
        .catch(error => next(error));
}

exports.Update = (req,res,next) =>{
    const id_registro = req.params.id_registro;
    const dadosRegistro = req.body

    registroService.atualizarRegistro(dadosRegistro, id_registro)
        .then(registro => {
            if (registro){
                res.status(200).send(registro)
            }
           else if(!registro){
                res.status(410).json({menssagem: "Registro já processado ou removido."});
            }
        })
        .catch(error => next(error));
}

exports.Delete = (req,res,next) => {
    const id = req.params.id_registro

    registroService.deletarRegistro(id)
        .then(registro=>{
            if(registro){
                res.status(200).send('Registro deletado com sucesso')

            }
            else{
                res.status(404).send('Registro não encontrado')
            }
        })
        .catch(error => next(error));
}