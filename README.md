# Infocash

O projeto **Infocash** é uma aplicação web desenvolvida para auxiliar os usuários no gerenciamento de suas finanças, promovendo maior controle e organização financeira. Através da aplicação, é possível registrar entradas e saídas de dinheiro, visualizar relatórios e obter insights sobre hábitos de consumo.

## Funcionalidades

- **Cadastro de Salários**: Registro das fontes de renda mensal.
- **Registro de Gastos Mensais**: Inclusão de despesas fixas, como contas de serviços, aluguel e outras obrigações recorrentes.
- **Registro de Gastos Diários**: Controle de despesas variáveis realizadas diariamente.
- **Relatórios e Gráficos**: Apresentação visual e analítica dos dados financeiros para melhor compreensão e planejamento.

## Tecnologias Utilizadas

- **Front-end**: React
- **Back-end**: Express
- **Banco de Dados**: Mysql

## Instruções para Configuração e Execução

1. **Clone o repositório**:  
   Utilize o comando abaixo para clonar o projeto:
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
   ```

2. **Instale as dependências**:  
   No diretório do projeto, execute:
   ```bash
   npm install
   ```
   ou o comando equivalente conforme a tecnologia utilizada.

3. **Inicie o servidor**:  
   Preencha os dados do seu banco de dados no arquivo .env:
   DB_HOST: '*digite o usuario do seu banco de dados*'
   DB_PASSWORD: '*digite a senha do seu banco de dados*'

   Vá no seu Mysql e crie um database chamado "infocash" com o comando:
   CREATE DATABASE infocash;

   Execute o comando para iniciar a aplicação:
   ```bash
   npm start
   ```
   ou o equivalente à configuração do projeto.

4. **Acesse a aplicação**:  
   Teste a api usando:
   ```
   http://localhost:3005/api/ *rota especifica que quer usar*
   ```

5. **Caso a rota seja /registro/esquecer-senha**:
   Para utilizar essa rota  você deve preencher os dados do transport do nodemailer presente no ./src/services/usuarioService.js(exports.esquercerSenha), para isso você deve cria/entrar na conta do mailtrap.io e esses dados são obtidos através do https://mailtrap.io/inboxes/3394619/settings onde vai conter na aba 'Integration' na seleção 'SMTP' o host,username e password que serão preenchido nesses seguintes campos:
   var transporter = nodemailer.createTransport({
      host: "", (host)
      port: 2525,
      auth: {
         user: "", (username)
         pass: ""   (password)
      }
   });

   Para o envio do link voce deve preencher o campo 'from:' com os dados fornecido na aba 'Email address' do mailtrap.io
   await transporter.sendMail({
    from: '', (campo que deve ser preenchido, ex: abc2222dee3334-b111@inbox.mailtrap.io)
    to: email,
    subject: 'Redefinir Senha',
    html: `<h2>Clique no link para redefinir sua senha:<h2> <a href="${resetLink}">clique aqui</a>`,
  });

## Contribuição

Contribuições para este projeto são sempre bem-vindas. Caso deseje colaborar, siga as etapas abaixo:

1. Faça um fork do repositório.
2. Crie uma nova branch para sua contribuição:
   ```bash
   git checkout -b minha-feature
   ```
3. Realize as alterações necessárias e faça commit:
   ```bash
   git commit -m "Descrição clara da alteração"
   ```
4. Envie suas alterações para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um **Pull Request** explicando as mudanças realizadas.



## Créditos

**Desenvolvedores**:  Vinicius Batista, [Pedro Henrique](https://linktr.ee/impedrohenri), e Luiz Felipe

