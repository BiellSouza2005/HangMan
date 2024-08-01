const palavras = ["PROGRAMACAO", "JAVASCRIPT", "DESENVOLVIMENTO", "INTERFACE"];
// Define the API URL
const apiUrl = 'http://localhost:5009/getRandomWord';
//-------------
//let palavraEscolhida = palavras[Math.floor(Math.random() * palavras.length)];
let palavraEscolhida = '';
let dica = '';
let letrasCertas = [];
let letrasIdentificadas = [];
let tentativasMaximas = 6;
let tentativasRestantes = tentativasMaximas;
let letrasTentadas = [];
let Score = 0;
let BestScore = 0;
let BestScoreRecuperado = localStorage.getItem('bestScore')

function atualizaLocalStorage() {
    localStorage.setItem('bestScore', JSON.stringify(BestScore))
}

if(BestScoreRecuperado) {
    BestScore = JSON.parse(BestScoreRecuperado);
    document.getElementById('bestScore').textContent = `Best Score: ${BestScore}`;
} else {
    BestScore = 0;
}

function definePalavra(wt){
    palavraEscolhida = wt;
    
}

function defineDica(tip) {
    dica = tip;
}

function retornaPalavraApi(){

    document.getElementById('botaoJogarDeNovo').style.display = 'none'; //Esconde o botão jogar de novo
    document.getElementById('score').textContent = `Score: ${Score}`;
    document.getElementById('bestScore').textContent = `Best Score: ${BestScore}`; 
    // Make a GET request
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
            })          
            .then(data => {
                definePalavra(data.wordText.toUpperCase())
                defineDica(data.tip)
                console.log(data);
                main();
            })
            .catch(error => {
                console.error('Error:', error);
            });      
}

function atualizarImagemForca(erros) {
    const imagemForca = document.getElementById('forcaImagem');
    imagemForca.src = `assets/forca${erros}.png`;
}

function adivinharLetra() {
    const letraInput = document.getElementById('letraInput');
    const letra = letraInput.value.toUpperCase();
    letraInput.value = '';



    if (letra.length === 0 || letrasTentadas.includes(letra)) { //Verifica se o input está vazio, e depois verifica se a letra já está incluida no array a partir do include
        return;
    } //A segunda condição no if impede que uma letra errada que já foi tentada penalize o jogador multiplas vezes

    //Adiciona a letra no array
    letrasTentadas.push(letra);
    document.getElementById('letrasTentadas').textContent = `Letras já tentadas: ${letrasTentadas.join(', ')}`;
  

    let letraCerta = false;
    for (let i = 0; i < palavraEscolhida.length; i++) {
        if (palavraEscolhida[i] === letra) {
            letrasCertas[i] = letra;
            letrasIdentificadas[i] = true;
            letraCerta = true;
        }
    }

    if (!letraCerta) {
        tentativasRestantes--;
    }

    atualizarImagemForca(tentativasMaximas - tentativasRestantes);
    document.getElementById('palavra').textContent = letrasCertas.join(' ');

    if (tentativasRestantes === 0) {
        document.getElementById('mensagem').textContent = `Fim do jogo! Você perdeu. A palavra era: ${palavraEscolhida}`;
        document.getElementById('botaoJogarDeNovo').style.display = 'block';
        Score = 0;
    } else if (!letrasCertas.includes('_')) {
        document.getElementById('mensagem').textContent = "Parabéns! Você ganhou!";
        document.getElementById('botaoJogarDeNovo').style.display = 'block';
        Score = Score + 1;

        if(Score > BestScore){
            BestScore = Score
        }

        document.getElementById('score').textContent = `Score: ${Score}`;
        document.getElementById('bestScore').textContent = `Best Score: ${BestScore}`; 
        atualizaLocalStorage(); 

    } else {
        document.getElementById('tentativasRestantes').textContent = `Tentativas restantes: ${tentativasRestantes}`;
    }
}

function chamarDica() {
    document.getElementById('dica').textContent = dica;
    document.getElementById('botaoDica').style.display = 'none';
    document.getElementById('dica').style.display = 'block';
}

function jogarDeNovo() {
    atualizarImagemForca(0);
    retornaPalavraApi();
    letrasTentadas = [];
    document.getElementById('mensagem').textContent = '';
    document.getElementById('letrasTentadas').textContent = `Letras já tentadas: ${letrasTentadas.join(', ')}`;
    document.getElementById('botaoDica').style.display = 'block';
    document.getElementById('dica').style.display = 'none';

    document.getElementById('botaoJogarDeNovo').style.display = 'none';
    document.getElementById('score').textContent = `Score: ${Score}`;
    document.getElementById('bestScore').textContent = `Best Score: ${BestScore}`;
      
}

function main(){
   
    letrasCertas = Array(palavraEscolhida.length).fill('_');
    letrasIdentificadas = Array(palavraEscolhida.length).fill(false);

    
    document.getElementById('palavra').textContent = letrasCertas.join(' ');
    document.getElementById('tentativasRestantes').textContent = `Tentativas restantes: ${tentativasRestantes}`;
    
    // Inicializar com a imagem da forca padrão
    atualizarImagemForca(0);
}


//jogarDeNovo();
//Chama API para recuperar a palavra aleatória do banco de dados
retornaPalavraApi();

//main();
