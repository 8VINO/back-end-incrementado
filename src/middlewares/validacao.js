
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validarCadastro(req,res, next){
    const { nome, email, senha, confirmar } = req.body;
    if (!nome){
        return res.status(422).json({mensagem:"O nome é obrigatório"})
    }
    if (!email){
        return res.status(422).json({mensagem:"O email é obrigatório"})
    }
    if (!regex.test(email)) {
        return res.status(422).json({ mensagme: "O email fornecido é inválido." });
      }
    if (!senha){
        return res.status(422).json({mensagem:"A senha é obrigatória"})
    }
    if (senha.length < 8) {
        return res.status(422).json({ mensagem: "A senha deve ter no mínimo 8 caracteres" });
    }
    if (senha!=confirmar){
        return res.status(422).json({mensagem:"Confirme a senha corretamente"})
    }

    next()
};

function validarLogin(req,res, next){
    const {email, senha} = req.body;
 
    
    if (!email){
        return res.status(422).json({mensagem:"O email é obrigatório"})
    }
    if (!regex.test(email)) {
         return res.status(422).json({ mensagme: "O email fornecido é inválido." });
    }
    
    if (!senha){
        return res.status(422).json({mensagem:"A senha é obrigatória"})
    }

    if (senha.length < 8) {
        return res.status(422).json({ mensagem: "A senha deve ter no mínimo 8 caracteres" });
    }
    
    next()
}


function validarEsquecerSenha(req,res,next){
    const {senhaNova, confirmar}= req.body
    if (!senhaNova){
        return res.status(422).json({mensagem:"O campo 'senhaNova' não pode estar vazio"})
    }
    if (senhaNova.length < 8) {
        return res.status(422).json({ mensagem: "A senha deve ter no mínimo 8 caracteres" });
    }
    if (senhaNova!=confirmar || confirmar == null){
        return res.status(422).json({mensagem:"Confirme a senha corretamente"})
    }

    next()
}

module.exports= {validarCadastro, validarLogin, validarEsquecerSenha};