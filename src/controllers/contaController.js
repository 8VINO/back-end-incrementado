const contaService = require('../services/contaService');

//Vai servir para atualizar a meta e enviar os dados para o service da conta que vai relizar toda a logica de negocio
exports.Update=(req,res,next)=>{
    const id = req.params.id_conta
    const dadosConta=req.body
    contaService.atualizarMeta(id,dadosConta)
    .then(meta => {
        if (meta) {
             res.status(200).send(meta);
        }
      
           res.status(500).json({ mensagem: 'Ocorreu um erro ao atualizar a meta.' });
        }).catch(error => next(error));
}


//vai buscar a conta que possui como id estrangeiro o id do usuario
exports.SearchOne = (req, res, next) => {
        const id = req.params.id_usuario;
    
        contaService.buscarContaPorId(id)
            .then(conta => {
                if (conta) {
                    res.status(200).send(conta);
                } else {
                    res.status(404).send('Conta não encontrada');
                }
            })
            .catch(error => next(error));
    };

//Vai procurar a meta associada aquela conta
exports.SearchMeta = (req, res, next) => {
        const id = req.params.id_conta;
    
        contaService.buscarMetaPorId(id)
            .then(meta => {
                if (meta) {
                    res.status(200).send(meta);
                } else {
                    res.status(404).send('Meta não encontrada');
                }
            })
            .catch(error => next(error));
    };

    