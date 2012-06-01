function diff_array(arr1, arr2){
    return arr1.filter(function(i) {return !(arr2.indexOf(i) > -1);});
}

function Agente(){
	this.alturaMaxima = 0;
	this.nosMaximos = 4000;
	this.tabuleirosVistos = {};
}

Agente.prototype.geraChaveTabuleirosVistos = function(tab){
	return tab.marcadas.sort(function(a,b){return a-b}).toString() + "," + tab.quadradosJogador.length + "," + tab.quadradosComputador.length;
}

Agente.prototype.setTabuleirosVistos = function(novoTabuleiro, retorno){
	var chave = this.geraChaveTabuleirosVistos(novoTabuleiro);
	this.tabuleirosVistos[chave] = retorno;
};

Agente.prototype.existeTabuleiro = function(tabuleiro){
	var chave = this.geraChaveTabuleirosVistos(tabuleiro);
	if(typeof(this.tabuleirosVistos[chave]) != "undefined"){
		return [ true, this.tabuleirosVistos[chave] ];
	}
	return [ false, false ];
};

Agente.prototype.jogadaComputador = function(tabuleiro){
    this.alturaMaxima = 0;
	this.tabuleirosVistos = {};
	var numArestasLivres = tabuleiro.getNumArestasLivres();
	var resultadoArestasLivres = 1;
	for(var num = numArestasLivres; num >= 1; num--){
	    resultadoArestasLivres = resultadoArestasLivres * num;
	    this.alturaMaxima++;
	    if(resultadoArestasLivres > this.nosMaximos){
	        break;
	    }
	}
	
	this.alturaMaxima--;
	if(this.alturaMaxima < 2){
		this.alturaMaxima = 2;
	}
	//alert(this.alturaMaxima);

	var tabuleiroNovo = this.percorreArvore({tabuleiro: tabuleiro, vez: "computador", computadorFechou: 0, jogadorFechou: 0, altura: 0});
	tabuleiroNovo = tabuleiroNovo.tabuleiro;
	return diff_array(tabuleiroNovo.marcadas, tabuleiro.marcadas);
}	

Agente.prototype.percorreArvore = function(elemento){
	var tabuleiro = elemento.tabuleiro;
	var vezTemp = elemento.vez;
	var computadorFechou = elemento.computadorFechou;
	var jogadorFechou = elemento.jogadorFechou;
	var altura = elemento.altura;
	
	var resposta = this.getCombinacoesTabuleiro(tabuleiro, vezTemp, computadorFechou, jogadorFechou);
	var prontaParaRecursao = Array();
	while(true){
		var precisaMaisUmaRodada = Array();
		for (var elemento in resposta){
			elemento = resposta[elemento];
			if (elemento.ultimaLinhaFechouQuadrado == false){
				prontaParaRecursao.push(elemento);
			}
			else{
				precisaMaisUmaRodada.push(elemento);
			}
		}
		if (precisaMaisUmaRodada.length == 0){
			break;
		}
		resposta = Array();
		for (var i=0;i<precisaMaisUmaRodada.length;i++){
			var respostaTemp = this.getCombinacoesTabuleiro(precisaMaisUmaRodada[i].tabuleiro, vezTemp, precisaMaisUmaRodada[i].computadorFechou, precisaMaisUmaRodada[i].jogadorFechou);
			resposta = resposta.concat(respostaTemp);
		}
	}
	var res = Array();
	if (altura+1<=this.alturaMaxima){
		var saldoRetorno = (vezTemp=="computador") ? -9999999 : 9999999;
		var tabuleiroRetorno = null;
		if(prontaParaRecursao.length > 0){
			for (var i=0;i<prontaParaRecursao.length;i++){
				var retorno = null;
				var retornoExisteTabuleiro = this.existeTabuleiro(prontaParaRecursao[i].tabuleiro);
				if(retornoExisteTabuleiro[0] == true){
					retorno = retornoExisteTabuleiro[1];
				}
				else{
					retorno = this.percorreArvore({tabuleiro: prontaParaRecursao[i].tabuleiro.clone(), vez: (vezTemp=="computador")?"jogador":"computador",
							computadorFechou: prontaParaRecursao[i].computadorFechou, jogadorFechou: prontaParaRecursao[i].jogadorFechou, altura: altura+1});
					this.setTabuleirosVistos(prontaParaRecursao[i].tabuleiro, retorno);
				}
				var saldoNovo = retorno.saldo;
				if (vezTemp=="computador"){
					if (saldoNovo > saldoRetorno){
						saldoRetorno = saldoNovo;
						tabuleiroRetorno = prontaParaRecursao[i].tabuleiro;
					}
				}
				else{
					if (saldoNovo < saldoRetorno){
						saldoRetorno = saldoNovo;
						tabuleiroRetorno = prontaParaRecursao[i].tabuleiro;
					}
				}
			}
			var retornoFinal = {saldo:saldoRetorno, tabuleiro: tabuleiroRetorno};
			return retornoFinal;
		}
	}
	
	/*Caso folha*/
	var saldo = computadorFechou - jogadorFechou + tabuleiro.heuristica(vezTemp);
	var retornoFinal = {saldo:saldo, tabuleiro: tabuleiro};
	return retornoFinal;
}

Agente.prototype.getCombinacoesTabuleiro = function(tabuleiro, vezTemp, computadorFechou, jogadorFechou){
	var resposta = Array();
	for (var aresta = 0; aresta < tabuleiro.getNumMaxArestas(); aresta++){
		var computadorFechouTemp = computadorFechou;
		var jogadorFechouTemp = jogadorFechou;
		if(!tabuleiro.arestaMarcada(aresta)){
			var fechouUltimaLinha = false;
			var tab = tabuleiro.clone();
			var quadrados = tab.getArestaQuadrados(aresta);
			for (var quadrado in quadrados){
				quadrado = quadrados[quadrado];
				if(tab.getNumArestasNaoMarcadas(quadrado[0], quadrado[1])==1){
					fechouUltimaLinha = true;
					if (vezTemp=="computador"){ computadorFechouTemp++; }
					else{ jogadorFechouTemp++; }
				}
			}
			tab.marcaArestas(aresta, vezTemp);
			if(tab.quadradosComputador.length + tab.quadradosJogador.length == tab.linhasQuadrados * tab.colunasQuadrados){
				fechouUltimaLinha = false;
			}
			var elemento = {tabuleiro: tab, ultimaLinhaFechouQuadrado: fechouUltimaLinha, 
					computadorFechou:computadorFechouTemp, jogadorFechou: jogadorFechouTemp};
			resposta.push(elemento);
		}
	}
	return resposta;
}
