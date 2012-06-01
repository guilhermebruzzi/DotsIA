function Agente(){
	this.alturaMaxima = 0;
	this.nosMaximos = 10000;
	this.tabuleirosVistos = Array();
}

Agente.prototype.jogadaComputador = function(tabuleiro){
    this.alturaMaxima = 0;
	this.tabuleirosVistos = Array();
	var numArestasLivres = tabuleiro.getNumArestasLivres();
	var resultadoArestasLivres = 1;
	for(var num = numArestasLivres; num >= 1; num--){
	    resultadoArestasLivres = resultadoArestasLivres * num;
	    this.alturaMaxima++;
	    if(resultadoArestasLivres > this.nosMaximos){
	        break;
	    }
	}
	var arestas = this.percorreArvore({tabuleiro: tabuleiro, vez: "computador", computadorFechou: 0, jogadorFechou: 0, altura: 0});
	return arestas;
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
		for (var i=0;i<prontaParaRecursao.length;i++){
			var retorno = this.percorreArvore({tabuleiro: prontaParaRecursao[i].tabuleiro, vez: (vezTemp=="computador")?"jogador":"computador",
					computadorFechou: prontaParaRecursao[i].computadorFechou, jogadorFechou: prontaParaRecursao[i].jogadorFechou, altura: altura+1});
			res.push(retorno);
		}
	}
	/*alert("marcadas: "+tabuleiro.marcadas+"\n"+
			"jogador fechou: "+jogadorFechou+"\n"+
			"computador fechou: "+computadorFechou+"\n"+
			"vez: "+vez+"\n"+
			"altura: "+altura);*/
	if (res.length == 0){
		var saldo = computadorFechou - jogadorFechou + tabuleiro.heuristica(vezTemp);
		return {saldo:saldo, tabuleiro: tabuleiro};
	}
	else{
		var saldoRetorno = (vezTemp=="computador")?-99999:99999;
		var tabuleiroRetorno = undefined;
		for (var num in res){
			num = res[num];
			var valor = num.saldo;
			var tabuleiroTemp = num.tabuleiro; 
			if (vezTemp=="computador"){
				if (valor > saldoRetorno){
					saldoRetorno = valor;
					tabuleiroRetorno = tabuleiroTemp;
				}
			}
			else{
				if (valor < saldoRetorno){
					saldoRetorno = valor;
					tabuleiroRetorno = tabuleiroTemp;
				}
			}
		}
		if (altura==0){
			var index = tabuleiro.marcadas.length;
			return tabuleiroRetorno.marcadas[index];
		}
		else{
			return {saldo: saldoRetorno, tabuleiro: tabuleiroRetorno};
		}
	}
}

Agente.prototype.getCombinacoesTabuleiro = function(tabuleiro, vezTemp, computadorFechou, jogadorFechou){
	var resposta = Array();
	for (var i=0;i<tabuleiro.linhasQuadrados;i++){
		for(var j=0; j<tabuleiro.colunasQuadrados;j++){
			var computadorFechouTemp = computadorFechou;
			var jogadorFechouTemp = jogadorFechou;
			var arestas = tabuleiro.getQuadradoArestas(j, i);
			for (var aresta in arestas){
				aresta = arestas[aresta];
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
		}
	}
	return resposta;
}
