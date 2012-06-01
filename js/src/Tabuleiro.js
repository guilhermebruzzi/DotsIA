vez = "jogador";

function associa_quadrado_arestas(mapa_arestas_quadrados, quadrado, arestas){
    for (var aresta_index in arestas){
        var aresta = arestas[aresta_index];
        if(mapa_arestas_quadrados[aresta]){
            mapa_arestas_quadrados[aresta].push(quadrado);
        }
        else{
            mapa_arestas_quadrados[aresta] = [ quadrado ];
        }
    }
}

function cria_mapa_arestas_quadrados(_linhas, _colunas){
    var pulo = (2 * _colunas) + 1;
    var mapa_arestas_quadrados = {};

    for(var y = 0; y < _linhas; y++){
	    for(var x = 0; x < _colunas; x++){
	        var quadrado = [x, y]
	        var aresta_cima = pulo*y + x;
	        var aresta_dir = pulo*y + x + _colunas + 1;
	        var aresta_baixo = pulo*(y+1) + x;
	        var aresta_esq = pulo*y + x + _colunas;
	        var arestas = [aresta_cima, aresta_dir, aresta_baixo, aresta_esq];
	        associa_quadrado_arestas(mapa_arestas_quadrados, quadrado, arestas);
	    }
	}
	
	return mapa_arestas_quadrados;
}

function isEqual(v1,v2) {
    if (v1.length != v2.length) return false;
    for (var i = 0; i < v1.length; i++) {
        if (v1[i] != v2[i])
            return false;   
    }
    return true;
}

function Tabuleiro(_linhas, _colunas, _marcadas, _quadradosJogador, _quadradosComputador, _mapa_arestas_quadrados){
	this.linhas = _linhas;
	this.colunas = _colunas;
	this.linhasQuadrados = _linhas - 1;
	this.colunasQuadrados = _colunas - 1;
	this.marcadas = (typeof(_marcadas) == "undefined" || _marcadas == null) ? [] : _marcadas;
	
	// Lista de vetores: [ [cordX, cordY], ]
	this.quadradosJogador = 
	    (typeof(_quadradosJogador) == "undefined" || _quadradosJogador == null) ? [] : _quadradosJogador; 
	this.quadradosComputador = 
	    (typeof(_quadradosComputador) == "undefined" || _quadradosComputador == null) ? [] : _quadradosComputador;

	this.mapa_arestas_quadrados = (typeof(_mapa_arestas_quadrados) == "undefined" || _mapa_arestas_quadrados == null) ? cria_mapa_arestas_quadrados(_linhas - 1, _colunas - 1) : _mapa_arestas_quadrados;
}

Tabuleiro.prototype.clone = function(){
	var copy = {};
	for (var attr in this.mapa_arestas_quadrados){
		if (this.mapa_arestas_quadrados.hasOwnProperty(attr)){
			copy[attr] = this.mapa_arestas_quadrados[attr];
		}
	}
    return new Tabuleiro(this.linhas, this.colunas, this.marcadas.slice(0), this.quadradosJogador.slice(0), this.quadradosComputador.slice(0), copy);
}

Tabuleiro.prototype.arestaMarcada = function(aresta){ // arestaMarcada(2) -> true ou false
    return ($.inArray(aresta, this.marcadas) !== -1); // $.inArray retorna -1 se nÃ£o achou
}

Tabuleiro.prototype.quadradoMarcado = function(quadrado){ // if( quadradoMarcado([2,1]) )
    return ($.inArray(quadrado, this.quadradosJogador) !== -1) || ($.inArray(quadrado, this.quadradosComputador) !== -1); // $.inArray retorna -1 se nÃ£o achou
}

Tabuleiro.prototype.marca = function(array_interno, valores_a_serem_marcados){
    if(typeof(valores_a_serem_marcados) == "number"){ // Apenas um elemento
        valores_a_serem_marcados = [valores_a_serem_marcados];
    }
    $.merge(array_interno, valores_a_serem_marcados);
}

Tabuleiro.prototype.marcaArestas = function(arestas, player){ // marcaAresta([1,2], "jogador" ou "computador")
    if (typeof(arestas) == "number"){
        arestas = [ arestas ];
    }
    while(arestas.length > 0){
        var aresta = arestas.pop();
        if (this.arestaMarcada(aresta)){
            continue;
        }
        this.marca(this.marcadas, aresta);
        var quadrados = [];
        var quadradosDaAresta = this.getArestaQuadrados(aresta);
        for (quadrado_index in quadradosDaAresta){
            var quadrado = quadradosDaAresta[quadrado_index];
            if(this.quadradoEstaCompleto(quadrado[0], quadrado[1])){
                quadrados.push(quadrado);
            }
        }
        
        if(quadrados.length > 0){ // Continuar com uma aresta aleatÃ³ria
            if(player == "computador"){
                this.addQuadradosComputador(quadrados);
            }
            else{
                this.addQuadradosJogador(quadrados);
            }
        }
    }
}

Tabuleiro.prototype.getNumMaxArestas = function(){
    return (2 * this.linhas * this.colunas) - this.linhas - this.colunas;
}

Tabuleiro.prototype.getNumArestasLivres = function(){
    return this.getNumMaxArestas() - this.marcadas.length;
}

Tabuleiro.prototype.addQuadradosJogador = function(novosQuadrados){
    if(typeof(novosQuadrados[0]) == "number"){ // Apenas um quadrado e nÃ£o uma lista de quadrados
        novosQuadrados = [ novosQuadrados ];
    }
    this.marca(this.quadradosJogador, novosQuadrados);
}

Tabuleiro.prototype.addQuadradosComputador = function(novosQuadrados){
    if(typeof(novosQuadrados[0]) == "number"){ // Apenas um quadrado e nÃ£o uma lista de quadrados
        novosQuadrados = [ novosQuadrados ];
    }
    this.marca(this.quadradosComputador, novosQuadrados);
}

/**
 * @param aresta O id da aresta
 * @return Retorna uma lista de duplas que definem os quadrados que tem a aresta parametro em sua formacao. 
 */
Tabuleiro.prototype.getArestaQuadrados = function(aresta){ // getArestaQuadrados(1) [ [1,2], [2,1] ]
    return this.mapa_arestas_quadrados[aresta];    
}

/**
 * @return Retorna uma lista das arestas que formam o quadrado (cordX, cordY) 
 */
Tabuleiro.prototype.getQuadradoArestas = function(cordX, cordY){ // getQuadradoArestas(2,1) -> retornar [0,6,7,13]
    var pulo = (2 * this.colunasQuadrados) + 1;
    
    var aresta_cima = pulo*cordY + cordX;
    var aresta_dir = pulo*cordY + cordX + this.colunasQuadrados + 1;
    var aresta_baixo = pulo*(cordY+1) + cordX;
    var aresta_esq = pulo*cordY + cordX + this.colunasQuadrados;
    var arestas = [aresta_cima, aresta_dir, aresta_baixo, aresta_esq];    
    
    return arestas;
}

Tabuleiro.prototype.quadradoEstaCompleto = function(cordX, cordY){
    var arestas = this.getQuadradoArestas(cordX, cordY);
    var countPreenchido = 0;
    for(var aresta_index in arestas){
        var aresta = arestas[aresta_index];
        if(this.arestaMarcada(aresta)){
            countPreenchido++;
        }
    }
    return (countPreenchido == 4);
}

/**
 * @return Retorna true se é possivel em algum lugar do tabuleiro marcar uma linha
 *  que seja a quarta linha de um dos quadrados que essa linha influencia, 
 *  retornar false caso contrario. 
 */
Tabuleiro.prototype.temMarcarQuartaLinha = function(){
	for (var i=0;i<this.linhasQuadrados;i++){
		for (var j=0;j<this.colunasQuadrados;j++){
			var arestas = this.getQuadradoArestas(j, i);
			var countPreenchido = 0;
			for(var aresta_index in arestas){
				var aresta = arestas[aresta_index];
				if(this.arestaMarcada(aresta)){
					countPreenchido++;
				}
			}
			if (countPreenchido == 3){ return true; }
		}
	}
	return false;
}

/**
 * @return Retorna 1 se é possivel em algum lugar do tabuleiro marcar uma linha
 *  que seja a terceira linha de um dos quadrados que essa linha influencia, 
 *  retornar 0 caso contrario. 
 */
Tabuleiro.prototype.temMarcarTerceiraLinha = function(){
    for (var i=0;i<this.linhasQuadrados;i++){
        for (var j=0;j<this.colunasQuadrados;j++){            
            var arestas = this.getQuadradoArestas(j, i);            
            var countPreenchido = 0;
            for(var aresta_index in arestas){
                var aresta = arestas[aresta_index];
                if(this.arestaMarcada(aresta)){
                    countPreenchido++;
                }
            }
            if (countPreenchido == 2){ return true; }
        }
    }
    return false;
}

/**
 * @param cordX Coordenada x de um quadrado
 * @param cordY Coordenada y de um quadrado
 * @return Retorna true se o quadrado sera fechado com apenas mais uma linha, 
 * retornar false caso contrario. 
 * O parametro passado pode valer null, nesse caso retornar false.
 */
Tabuleiro.prototype.podeFechar = function(cordX, cordY) {
    var arestas = this.getQuadradoArestas(cordX, cordY);
    var countPreenchido = 0;
    for(var aresta_index in arestas){
        var aresta = arestas[aresta_index];
        if(this.arestaMarcada(aresta)){
            countPreenchido++;
        }
    }
    return (countPreenchido == 3);    
} 

/**
 * @return Retorna true se é possivel em algum lugar do tabuleiro marcar uma linha que 
 * seja a primeira ou segunda linha dos quadrados que essa linha influencia, retornar false caso contrario. 
 */
Tabuleiro.prototype.temMarcarPrimeiraOuSegundaLinha = function() {
    var countPrimeiraOuSegunda = 0;
    for (var i=0;i<this.linhasQuadrados;i++){
        for (var j=0;j<this.colunasQuadrados;j++){            
            var arestas = this.getQuadradoArestas(j, i);            
            var countPreenchido = 0;
            for(var aresta_index in arestas){
                var aresta = arestas[aresta_index];
                if(this.arestaMarcada(aresta)){
                    countPreenchido++;
                }
            }            
            if (countPreenchido <= 1) {
                countPrimeiraOuSegunda++;                
            }         
        }
    }    
    return (countPrimeiraOuSegunda>0);
}

Tabuleiro.prototype.getQuadradoMenorTubo = function(){	
	var tabuleiroTemp = this.clone();
	tabuleiroTemp.marcaTerceiraLinha(0,0,"jogador");
	var quadradoDoMenorTubo;
	var tamanhoMenorTubo = Number.MAX_VALUE;
    for (var i=0;i<this.linhasQuadrados;i++){
        for (var j=0;j<this.colunasQuadrados;j++){ 
			if (this.quadradoEstaCompleto(j,i)){
				continue;
			}
			var quadradoTemp = [j,i];
			var tamanhoTemp = 0;
			var arestasDesmarcadas = Array();
			var arestas = this.getQuadradoArestas(j,i);
			for (var aresta in arestas){
				aresta = arestas[aresta];
				if (!this.arestaMarcada(aresta)){
					arestasDesmarcadas.push(aresta);
				}
			}
			var tabuleiroTemp = this.clone();
			if (arestasDesmarcadas.length == 2){
				tabuleiroTemp.marcaTerceiraLinha(j,i,"jogador");
				while(tabuleiroTemp.temMarcarQuartaLinha()){
					var quadradoInfluenciado = tabuleiroTemp.marcaQualquerQuartaLinha("jogador");
					if (quadradoInfluenciado.length == 2){
						if (tabuleiroTemp.quadradoEstaCompleto(quadradoInfluenciado[0], quadradoInfluenciado[1])){
							tamanhoTemp++;
						}
					}
					tamanhoTemp++;
				}
			}
			if (arestasDesmarcadas.length > 2){
				for (var aresta in arestasDesmarcadas) {
					aresta = arestasDesmarcadas[aresta];
					var tabuleiroArestaTemp = tabuleiroTemp.clone();
					tabuleiroArestaTemp.marcaArestas(aresta, "jogador");
					tabuleiroArestaTemp.marcaTerceiraLinha(j,i,"jogador");
					tamanhoTemp=0;
					while(tabuleiroArestaTemp.temMarcarQuartaLinha()){
						var quadradoInfluenciado = tabuleiroArestaTemp.marcaQualquerQuartaLinha("jogador");
						if (quadradoInfluenciado.length == 2){
							if (tabuleiroArestaTemp.quadradoEstaCompleto(quadradoInfluenciado[0], quadradoInfluenciado[1])){
								tamanhoTemp++;
							}
						}
						tamanhoTemp++;
					}
					if (tamanhoTemp < tamanhoMenorTubo){
						tamanhoMenorTubo = tamanhoTemp;
						quadradoDoMenorTubo = quadradoTemp;
					}
				}
			}
			if (tamanhoTemp < tamanhoMenorTubo){
				tamanhoMenorTubo = tamanhoTemp;
				quadradoDoMenorTubo = quadradoTemp;
			}
		}
	}
	return {quadradoMinimo: quadradoDoMenorTubo, tamanhoMinimo: tamanhoMenorTubo};
}

/**
* Marca terceira linha no quadrado que foi passado por parametro em qualquer uma das 2 arestas que sao possiveis
* @param cordX Coordenada x de um quadrado
* @param cordY Coordenada y de um quadrado
* @param player "jogador" ou "computador"
* @return Retorna true se conseguiu marcar uma terceira linha do quadrado parametro.
 */
Tabuleiro.prototype.marcaTerceiraLinha = function(cordX, cordY, player) {
    var arestas = this.getQuadradoArestas(cordX, cordY);
    var countPreenchido = 0;
    var arestaAmarcar;
    for(var aresta_index in arestas){
        var aresta = arestas[aresta_index];
        if(this.arestaMarcada(aresta)){
            countPreenchido++;            
        } else {
            arestaAmarcar = aresta;
        }
    }
    if (countPreenchido==2) {
        this.marcaArestas(arestaAmarcar,player);
        return true;        
    }
    return false;
}

/**
 * Marca no tabuleiro qualquer uma linha que seja a quarta linha de um quadrado.
 * @return Retorna o outro quadrado que essa linha tambem influencia. 
 * Caso essa linha nao influencie nenhum outro quadrado retorne []
 */
Tabuleiro.prototype.marcaQualquerQuartaLinha = function(player) {
    var arestaAmarcar = undefined;
    var quadradoFechado;
    for (var i=0;i<this.linhasQuadrados;i++){
        for (var j=0;j<this.colunasQuadrados;j++){            
            var arestas = this.getQuadradoArestas(j, i);            
            var countPreenchido = 0;
            for(var aresta_index in arestas){
                var aresta = arestas[aresta_index];
                if(this.arestaMarcada(aresta)){
                    countPreenchido++;
                } else {
                    quadradoFechado = [j,i];
                    arestaAmarcar = aresta;
                }
            }   
            if (countPreenchido == 3 && arestaAmarcar != undefined) {
                this.marcaArestas(arestaAmarcar,player);         
                var quadradosDaAresta = this.getArestaQuadrados(arestaAmarcar);
                if (quadradosDaAresta.length > 1) {
                    for (var i in quadradosDaAresta) {
                        if (!isEqual(quadradosDaAresta[i],quadradoFechado)) {                                                        
                            return quadradosDaAresta[i];  
                        }
                    }  
                } else {
                    return [];
                }                               
            }
        }
    }    
}
 
/**
* Marca no tabuleiro a quarta linha do quadrado passado por parametro
* @param cordX Coordenada x do quadrado
* @param coordY Coordenada y do quadrado
* @player "jogador" ou "computador" 
* @return Retorna um vetor que contem: na primeira posição o outro quadrado que essa 4a linha feita tambem influencia e
*  na segunda posição a quantidade de quadrados simultaneamente fechados ao se fazer essa quarta linha (pode ser 1 ou 2)
* Retorna null caso nao consiga marcar a quarta linha no quadrado passado por parametro.
 */
Tabuleiro.prototype.marcaQuartaLinha = function(cordX, cordY, player) {
    var arestas = this.getQuadradoArestas(cordX, cordY);
    var countPreenchido = 0;
    var arestaAmarcar = undefined;
    for(var aresta_index in arestas){
        var aresta = arestas[aresta_index];
        if(this.arestaMarcada(aresta)){
            countPreenchido++;            
        } else {
            arestaAmarcar = aresta;
        }
    }
    if (countPreenchido==3 && arestaAmarcar != undefined) {        
        var ret = {};
        ret.quadradoInfluenciado = undefined;
        ret.qtdFechadosSimultaneamente = 1;
        var quadradosDaAresta = this.getArestaQuadrados(arestaAmarcar);
        if (quadradosDaAresta.length > 1) { // Espera-se que quando quadrados.length > 1, quadrados possua aresta interna (ou seja, as que nao circundam o tabuleiro) que é o que queremos testar.
            for (var i in quadradosDaAresta) {
                if (!isEqual(quadradosDaAresta[i],[cordX, cordY])) {
                    ret.quadradoInfluenciado = quadradosDaAresta[i];
                    if (this.podeFechar(ret.quadradoInfluenciado[0],ret.quadradoInfluenciado[1])) {
                        ret.qtdFechadosSimultaneamente = 2;                        
                    }               
               }
            }            
        }   
		this.marcaArestas(arestaAmarcar,player);
        return ret;
    }
    return null;    
}

Tabuleiro.prototype.heuristica = function(vez){
	var tab = this.clone();
	var jogadaMacete = 0;
	var quantosFechei = 0;

	while(tab.temMarcarQuartaLinha()){
		var quadradoAdjacente = tab.marcaQualquerQuartaLinha();
		quantosFechei++;
		var tamanhoTubo = 1;
		var qtdQuadradosFechadoSimultaneamente = 1;
		if (quadradoAdjacente.length == 2){
			if (tab.quadradoEstaCompleto(quadradoAdjacente[0], quadradoAdjacente[1])){
				qtdQuadradosFechadoSimultaneamente = 2;
			}
		}
		var vetorResposta = {quadradoInfluenciado: quadradoAdjacente, qtdFechadosSimultaneamente: qtdQuadradosFechadoSimultaneamente};
		if (quadradoAdjacente.length == 2){
			while(tab.podeFechar(quadradoAdjacente[0], quadradoAdjacente[1])){
				vetorResposta = tab.marcaQuartaLinha(quadradoAdjacente[0], quadradoAdjacente[1], "jogador");
				quantosFechei++;
				tamanhoTubo++;
				if (vetorResposta.quadradoInfluenciado!=undefined && vetorResposta.quadradoInfluenciado.length == 2){
					quadradoAdjacente = vetorResposta.quadradoInfluenciado;
				}
				else{
					break;
				}
			}
		}
		qtdQuadradosFechadoSimultaneamente = vetorResposta.qtdFechadosSimultaneamente;
		if (qtdQuadradosFechadoSimultaneamente == 1){
			if (tamanhoTubo >= 2){
				jogadaMacete = 2;
			}
		}
		if (qtdQuadradosFechadoSimultaneamente == 2){
			quantosFechei++;
			tamanhoTubo++;
			if (tamanhoTubo >= 4 && jogadaMacete == 0){
				jogadaMacete = 4;
			}
		}
	}
	if (tab.temMarcarPrimeiraOuSegundaLinha()){
		if (vez == "computador"){ return quantosFechei; }
		else{ return -quantosFechei; }
	}
	if (!tab.temMarcarPrimeiraOuSegundaLinha() && !tab.temMarcarTerceiraLinha() && !tab.temMarcarQuartaLinha()){
		if (vez == "computador"){ return quantosFechei; }
		else{ return -quantosFechei; }
	}
	var marqueiTerceiraLinha = false;
	var vetorResposta2 = tab.getQuadradoMenorTubo();
	var quadrado = vetorResposta2.quadradoMinimo;
	var quantidadeAdversarioFecharia = vetorResposta2.tamanhoMinimo;
	if (jogadaMacete == 2){
		if (quantidadeAdversarioFecharia > 2){
			marqueiTerceiraLinha = true;
			quantosFechei = quantosFechei - 2;
			tab.marcaTerceiraLinha(quadrado[0], quadrado[1], vez);
			var x = tab.heuristica(vez);
			if (vez == "computador"){ return quantosFechei - 2 + x; }
			else{ return -quantosFechei + 2 + x; }
		}
	}
	if (jogadaMacete == 4){
		if (quantidadeAdversarioFecharia > 4){
			marqueiTerceiraLinha = true;
			quantosFechei = quantosFechei - 4;
			tab.marcaTerceiraLinha(quadrado[0], quadrado[1], vez);
			var x = tab.heuristica(vez);
			if (vez == "computador"){ return quantosFechei - 4 + x; }
			else{ return -quantosFechei + 4 + x; }
		}
	}
	if (!marqueiTerceiraLinha){
		tab.marcaTerceiraLinha(quadrado[0], quadrado[1], vez);
		var x = tab.heuristica((vez=="jogador")?"computador":"jogador");
		if (vez == "computador"){ return quantosFechei + x; }
		else{ return -quantosFechei + x; }
	}
}

Tabuleiro.prototype.getNumArestasNaoMarcadas = function(coordX, coordY){
	var arestas = this.getQuadradoArestas(coordX, coordY);
	var cont = 0;
	for (var aresta in arestas){
		aresta = arestas[aresta];
		if (!this.arestaMarcada(aresta)){
			cont++;
		}
	}
	return cont;
}
