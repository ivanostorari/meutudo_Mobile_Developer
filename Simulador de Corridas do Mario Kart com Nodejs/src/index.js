const readline = require('readline');
function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(question, answer => {
        rl.close();
        resolve(answer);
    }));
}

const jogadores = [
    {NOME: "Mario", VELOCIDADE: 4, MANOBRABILIDADE: 3, PODER: 3, PONTOS: 0},
    {NOME: "Luigi", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 4, PONTOS: 0},
    {NOME: "Peach", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 2, PONTOS: 0},
    {NOME: "Yoshi", VELOCIDADE: 2, MANOBRABILIDADE: 4, PODER: 3, PONTOS: 0},
    {NOME: "Bowser", VELOCIDADE: 3, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0},
    {NOME: "Donkey Kong", VELOCIDADE: 2, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0},
];

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;  
};

async function sortearItem(player1, player2) {
    const chance = Math.random();
    if (chance < 0.3) { // 30% de chance de item aparecer
        const sorteado = Math.random() < 0.6 ? player1 : player2;
        sorteado.TEM_ITEM = "BANANA";
        console.log(`🍌 ${sorteado.NOME} foi acertado por uma banana! Não poderá pontuar nesta rodada.`);
    }
}

async function getRandomBlock() {
    let random = Math.random();
    let result;

    switch (true) {
        case random < 0.33:
            result = "RETA";
            break;
        case random < 0.66:
            result = "CURVA";
            break;
        default:
            result = "CONFRONTO";
        }

    return result;
};

async function  logRollResult(characterName, block, diceResult, attribute) {
    console.log(`${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}

async function playRaceEngine(character1, character2){
    for (let round = 1; round <= 5; round++) {
        character1.TEM_ITEM = null;
        character2.TEM_ITEM = null;
        console.log(`🏁 Rodada ${round}`);

        // sorteia o bloco
        let block = await getRandomBlock();
        console.log(`Bloco: ${block}`);

        // rola os dados
        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        //teste de habilidade
        let totalTestSkill1 = 0
        let totalTestSkill2 = 0

        if(block === "RETA") {
            sortearItem(character1, character2);
            totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
            totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

            await logRollResult(character1.NOME, "velocidade", diceResult1, character1.VELOCIDADE);
            await logRollResult(character2.NOME, "velocidade", diceResult2, character2.VELOCIDADE);
        }
        if(block === "CURVA") {
            totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
            totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

            await logRollResult(character1.NOME, "manobrabilidade", diceResult1, character1.MANOBRABILIDADE);
            await logRollResult(character2.NOME, "manobrabilidade", diceResult2, character2.MANOBRABILIDADE);
        }
        if(block === "CONFRONTO") {
            let powerResult1 = diceResult1 + character1.PODER;
            let powerResult2 = diceResult2 + character2.PODER;

            console.log(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`)

            await logRollResult(character1.NOME, "poder", diceResult1, character1.PODER);
            await logRollResult(character2.NOME, "poder", diceResult2, character2.PODER);
            
            if(powerResult1 > powerResult2 && character2.PONTOS > 0) {
                console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu um ponto! 🐢`);
                character2.PONTOS--;
            }

            if(powerResult2 > powerResult1 && character1.PONTOS > 0) {
                console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu um ponto! 🐢`);
                character1.PONTOS--;
            }

            console.log(powerResult2 === powerResult1 ? "Confronto empatado! Nenhum ponto foi perdido." : "")
        }

        // verificando o vencendor
        if (totalTestSkill1 > totalTestSkill2) {
            if (character1.TEM_ITEM === "BANANA") {
                console.log(`${character1.NOME} teria marcado ponto, mas escorregou na casca de banana! 🍌`);
            } else {
                console.log(`${character1.NOME} marcou um ponto!`);
                character1.PONTOS++;
            }
        } else if (totalTestSkill2 > totalTestSkill1) {
            if (character2.TEM_ITEM === "BANANA") {
                console.log(`${character2.NOME} teria marcado ponto, mas escorregou na casca de banana! 🍌`);
            } else {
                console.log(`${character2.NOME} marcou um ponto!`);
                character2.PONTOS++;
            }
        }
        console.log("--------------------------------------------------");
    }
};

async function declareWinner(character1, character2) {
    console.log(`🏁 Resultado final:`);
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

    if (character1.PONTOS > character2.PONTOS) {
        console.log(`\n${character1.NOME} venceu a corrida! Parabéns! 🏆`);
    } else if (character2.PONTOS > character1.PONTOS) {
        console.log(`\n${character2.NOME} venceu a corrida! Parabéns! 🏆`);
    } else {
        console.log("A corrida terminou em empate! 🤝");
    }
};

(async function main(){
    // Exibe os personagens disponíveis
    console.log("Escolha um personagem:");
    jogadores.forEach((jogador, index) => {
        console.log(`${index + 1}. ${jogador.NOME} (VEL: ${jogador.VELOCIDADE}, MAN: ${jogador.MANOBRABILIDADE}, POD: ${jogador.PODER})`);
    });

    // Escolha de personagens
    let escolha1 = await ask("Digite o número do primeiro personagem: ");
    let escolha2 = await ask("Digite o número do segundo personagem (diferente do primeiro): ");

    const player1 = { ...jogadores[Number(escolha1) - 1], PONTOS: 0, TEM_ITEM: null };
    const player2 = { ...jogadores[Number(escolha2) - 1], PONTOS: 0, TEM_ITEM: null };

    console.log(
        `🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...\n`
    );

    await playRaceEngine(player1, player2);
    await declareWinner(player1, player2);
})();
