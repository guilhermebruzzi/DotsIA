function Agente(){
	this.alturaMaxima = 4;
}

Agente.prototype.MAXIMO_NOS_PROCESSAR = 50;

Agente.prototype.jogadaComputador = function(tabuleiro){
	//this.fila.push({tabuleiro: tabuleiro, vez: "computador", computadorFechou: 0, jogadorFechou: 0, altura: 0, pai: -1});
	this.percorreArvore({tabuleiro: tabuleiro, vez: "computador", computadorFechou: 0, jogadorFechou: 0, altura: 0});
	console.log("acabou descida");
	
	/*for(var y = 0; y < tabuleiro.linhasQuadrados; y++){
	    for(var x = 0; x < tabuleiro.colunasQuadrados; x++){
	        var arestas = tabuleiro.getQuadradoArestas(x, y);
	        for (var aresta_index in arestas){
	            var aresta = arestas[aresta_index];
	            if(!tabuleiro.arestaMarcada(aresta)){
	                return aresta;
	            }
	        }
	    }
	}*/
	return -1;
}	

Agente.prototype.percorreArvore = function(elemento){
	var tabuleiro = elemento.tabuleiro;
	var vez = elemento.vez;
	var computadorFechou = elemento.computadorFechou;
	var jogadorFechou = elemento.jogadorFechou;
	var altura = elemento.altura;
	
	var resposta = this.getCombinacoesTabuleiro(tabuleiro, vez, computadorFechou, jogadorFechou);
	var prontaParaRecursao = Array();
	var precisaMaisUmaRodada = Array();
	while(true){
		precisaMaisUmaRodada = Array();
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
			var respostaTemp = this.getCombinacoesTabuleiro(precisaMaisUmaRodada[i].tabuleiro, vez, precisaMaisUmaRodada[i].computadorFechou, precisaMaisUmaRodada[i].jogadorFechou);
			resposta = resposta.concat(respostaTemp);
		}
	}
	if (altura+1<=this.alturaMaxima){
		for (var i=0;i<prontaParaRecursao.length;i++){
			this.percorreArvore({tabuleiro: prontaParaRecursao[i].tabuleiro, vez: (vez=="computador")?"jogador":"computador",
					computadorFechou: prontaParaRecursao[i].computadorFechou, jogadorFechou: prontaParaRecursao[i].jogadorFechou, altura: altura+1});
		}
	}
	alert("altura:"+altura+" vez:"+vez+" marcadas:"+tabuleiro.marcadas);
	return;
}

Agente.prototype.getCombinacoesTabuleiro = function(tabuleiro, vez, computadorFechou, jogadorFechou){
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
	                		if (vez=="computador"){ computadorFechouTemp++; }
	                		else{ jogadorFechouTemp++; }
	                	}
	                }
					tab.marcaArestas(aresta, vez);
					var elemento = {tabuleiro: tab, ultimaLinhaFechouQuadrado: fechouUltimaLinha, 
							computadorFechou:computadorFechouTemp, jogadorFechou: jogadorFechouTemp};
					resposta.push(elemento);
				}
			}
		}
	}
	return resposta;
}