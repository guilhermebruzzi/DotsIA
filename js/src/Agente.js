function Agente(){
	this.numeroNosProcessados = 0;
	this.fila = Array();
	this.acabarArvore = false;
	this.alturaMaxima = -1;
}

Agente.prototype.MAXIMO_NOS_PROCESSAR = 50;

Agente.prototype.jogadaComputador = function(tabuleiro){
	this.numeroNosProcessados=0;
	this.fila = Array();
	this.fila.push({tabuleiro: tabuleiro, vez: "computador", computadorFechou: 0, jogadorFechou: 0, altura: 0, pai: -1});
	this.numeroNosProcessados = 0;
	this.acabarArvore = false;
	this.alturaMaxima = -1;
	this.percorreArvore();
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

Agente.prototype.percorreArvore = function(){
	this.numeroNosProcessados++;
	var elemento = this.fila.shift();
	var tabuleiro = elemento.tabuleiro;
	var vez = elemento.vez;
	var computadorFechou = elemento.computadorFechou;
	var jogadorFechou = elemento.jogadorFechou;
	var altura = elemento.altura;
	var pai = elemento.pai;
	var identificacao = this.numeroNosProcessados;
	
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
	if (this.numeroNosProcessados+prontaParaRecursao.length > this.MAXIMO_NOS_PROCESSAR){
		this.acabarArvore = true;
		return;
		
	}
	for (var i=0;i<prontaParaRecursao.length;i++){
		this.fila.push({tabuleiro: prontaParaRecursao[i].tabuleiro, vez: (vez=="computador")?"jogador":"computador",
				computadorFechou: prontaParaRecursao[i].computadorFechou, jogadorFechou: prontaParaRecursao[i].jogadorFechou, altura: altura+1, pai: identificacao});
	}
	while(this.fila.length!=0 && this.acabarArvore==false){this.percorreArvore();}
	
	if (this.alturaMaxima == -1){
		this.alturaMaxima = altura;
	}
	if (altura == this.alturaMaxima){
		alert("folha["+identificacao+"|"+pai+"] "+vez+" "+altura+" "+computadorFechou+" "+jogadorFechou+" "+tabuleiro.heuristica(vez));
	}
	else{
		alert("["+identificacao+"|"+pai+"] "+vez+" "+altura);
	}
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