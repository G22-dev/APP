
///App criando em 10/08, feito por AG PINHEIRO
///Objetivo do App Criar um aplicativo de cadastramento de metas.

const { select, input, checkbox } = require('@inquirer/prompts');
const { read, writeFile } = require('fs');

const fs = require('fs').promises 

///função meta.
let mensagem = "Bem Vindo ao App de Metas";

/// Meta pre-cadastrada.
let metas

const Carregarmetas = async () => {
    try{
        const dados = await fs.readFile('metas.json', 'utf-8')
        metas = JSON.parse(dados)
    }
    catch(erro){}

    metas = []
}

const Salvarmetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

/// Cadastro de metas pelo Usuario.

const CadastrarMetas = async () => {
    const meta = await input({message:"Digite a meta: "})

    if(meta.length == 0){
        mensagem = ("A meta não foi cadastrada ")
        return

    }

    metas.push({ value: meta, checked: false })

    mensagem = 'Meta Cadastrada com Sucesso!!!'
}

///Lista metas, macar como concluidas.
const ListarMetas = async () => {
    if(metas.length == 0){
        mensagem = 'Não existem metas realizadas'
        return
    }

    const respostas = await checkbox({
        message: 'Use setas para mudar de meta, espaço para marcar ou desmarcar a meta e o enter para finalizar essa etapa',
        choices: [...metas],
        instructions: false,
})
    
    metas.forEach((m) => {
        m.checked = false
    })
    
    if(respostas.length == 0){
        console.log('Nenhuma meta selecionada')
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta

        })

        meta.checked = true

        mensagem = ('Meta(s) Marcadas como concluida(s)')
    })
}

///Apresenta Metas Realizadas.
const Metasrealizadas = async () => {
    if(metas.length == 0){
        mensagem = 'Não existem metas realizadas'
        return
    }
    
    const realizadas = metas.filter((meta) =>{
    return meta.checked
    }) 

    if(realizadas.length == 0){
        mensagem = ('Não existem metas realizadas')
        return
    }

    await select({
        message: 'Metas Realizadas: '+ realizadas.length,
        choices: [...realizadas]
    })
}

///Metas em aberto.
const Metasabertas = async () => {
    if(metas.length == 0){
        mensagem = 'Não existem metas realizadas'
        return
    }

    const abertas = metas.filter((metas) => {
    return metas.checked != true
    })

    if(abertas.length == 0){
    mensagem = ('Não existem metas em abeto!!!')
    return
    }

    await select ({
        message:'Metas Abertas: '+ abertas.length ,
        choices:[...abertas]

    })
}

/// sistema de deletar metas.
const Deletarmetas = async () => {
    if(metas.length == 0){
        mensagem = 'Não existem metas realizadas'
        return
    }

    const Metasdesmarcadas = metas.map((metas) => {
        return {value: meta.value, checked: false}
})
    
    const Itensadeletar = await checkbox({
        message: 'Selecione um item para deletar',
        choices: [...Metasdesmarcadas],
        instructions: false,
    })
    
    if(Itensadeletar.length == 0){
        mensagem = ('Nenhum item para deletar')
        return
    }

    Itensadeletar.forEach((item) => {
        meta = metas.filter
        return meta.value != item
    })
}

/// sistema de mensagem.
const Mostrarmensagem = () => {
    console.clear();

    if(mensagem != " "){
        console.log(mensagem)
        console.log(" ")
        mensagem = " "

    }
}

// Menu e select.
const start = async () => {
     await Carregarmetas()
     
 
    while(true){
        Mostrarmensagem()
        await Salvarmetas()
        
        const opcao = await select({
        message: "Menu > ",
        choices: [
            {
                name: "Cadastrar metas ",
                value: "Cadastrar"
            },
            {
                name: "Listar metas",
                value: "Listar"
            },
            {
                name: "Metas realizadas",
                value: "Realizadas"
            },
            {
                name: "Metas abertas",
                value: "Abertas"
            },
            {
                name: "Deletar metas",
                value: "Deletar"
            },
            {
                name: "Sair",
                value: "Sair"
            },     
        ]
    })
/// opções do menu.    
        switch(opcao){
            case "Cadastrar":
                await CadastrarMetas()
                break
            case "Listar":
                await ListarMetas()
                break
            case "Realizdas":
                await Metasrealizadas()
                break
            case "Abertas":
                await Metasabertas()
                break
            case "Deletar":
                await Deletarmetas()
                break
            case "Sair":
                mensagem = ("Até a proxima") 
                return          
        }

    }
}


start()