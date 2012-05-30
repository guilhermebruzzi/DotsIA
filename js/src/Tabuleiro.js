vez = "jogador";

function chave_quadrado(quadrado){
    return "[" + quadrado[0] + "," + quadrado[1] + "]";
}

function associa_quadrado_arestas(mapa_quadrados_arestas, mapa_arestas_quadrados, quadrado, arestas){
    mapa_quadrados_arestas[chave_quadrado(quadrado)] = arestas;
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
    var pulo = (2 * _colunas) + 1,
        mapa_quadrados_arestas = {},
        mapa_arestas_quadrados = {};

    for(var y = 0; y < _linhas; y++){
	    for(var x = 0; x < _colunas; x++){
	        var quadrado = [x, y]
	        var aresta_cima = pulo*y + x;
	        var aresta_dir = pulo*y + x + _colunas + 1;
	        var aresta_baixo = pulo*(y+1) + x;
	        var aresta_esq = pulo*y + x + _colunas;
	        var arestas = [aresta_cima, aresta_dir, aresta_baixo, aresta_esq];
	        associa_quadrado_arestas(mapa_quadrados_arestas, mapa_arestas_quadrados, quadrado, arestas);
	    }
	}
	
	return [mapa_quadrados_arestas, mapa_arestas_quadrados];
}

function isEqual(v1,v2) {
    if (v1.length != v2.length) return false;
    for (var i = 0; i < v1.length; i++) {
        if (v1[i] != v2[i])
            return false;   
    }
    return true;
}
/*
Array.prototype.isEqual = function(v) {
    var len = this.length;  
    for (var i = 0; i < len; i++) {
        if (this[i] != v[i])
            return false;       
    }
    return true;
}
*/

function Tabuleiro(_linhas, _colunas, _marcadas, _quadradosJogador, _quadradosComputador){
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

	var mapas = cria_mapa_arestas_quadrados(_linhas - 1, _colunas - 1);
	this.mapa_quadrados_arestas = mapas[0];
	this.mapa_arestas_quadrados = mapas[1];
}

Tabuleiro.prototype.clone = function(){
    return new Tabuleiro(this.linhas, this.colunas, this.marcadas, this.quadradosJogador, this.quadradosComputador);
}

Tabuleiro.prototype.arestaMarcada = function(aresta){ // arestaMarcada(2) -> true ou false
    return ($.inArray(aresta, this.marcadas) !== -1); // $.inArray retorna -1 se não achou
}

Tabuleiro.prototype.quadradoMarcado = function(quadrado){ // if( quadradoMarcado([2,1]) )
    return ($.inArray(quadrado, this.quadradosJogador) !== -1) || ($.inArray(quadrado, this.quadradosComputador) !== -1); // $.inArray retorna -1 se não achou
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
        this.marca(this.marcadas, aresta);
        var quadrados = [];
        var quadradosDaAresta = this.getArestaQuadrados(aresta);
        for (quadrado_index in quadradosDaAresta){
            var quadrado = quadradosDaAresta[quadrado_index];
            if(this.quadradoEstaCompleto(quadrado[0], quadrado[1])){
                quadrados.push(quadrado);
            }
        }
        
        if(quadrados.length > 0){ // Continuar com uma aresta aleatória
            if(player == "computador"){
                this.addQuadradosComputador(quadrados);
				return; // Computador continua a jogar
            }
            else{
                this.addQuadradosJogador(quadrados);
                vez = "jogador";
                return; // Jogador continua a jogar
            }
        }
    }
    if(vez == "computador"){ // Terminou de executar o pc
        vez = "jogador";
    }
    else{  // Terminou de jogar o jogador
        vez = "computador";
    }
}

Tabuleiro.prototype.addQuadradosJogador = function(novosQuadrados){
    if(typeof(novosQuadrados[0]) == "number"){ // Apenas um quadrado e não uma lista de quadrados
        novosQuadrados = [ novosQuadrados ];
    }
    this.marca(this.quadradosJogador, novosQuadrados);
}

Tabuleiro.prototype.addQuadradosComputador = function(novosQuadrados){
    if(typeof(novosQuadrados[0]) == "number"){ // Apenas um quadrado e não uma lista de quadrados
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
 * @return Retorna uma lista das arestas marcadas que formam o quadrado (cordX, cordY) 
 */
Tabuleiro.prototype.getQuadradoArestas = function(cordX, cordY){ // getQuadradoArestas(2,1) -> retornar [0,6,7,13]
    return this.mapa_quadrados_arestas[chave_quadrado([cordX, cordY])];
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
 * @return Retorna true se � possivel em algum lugar do tabuleiro marcar uma linha
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
 * @return Retorna 1 se � possivel em algum lugar do tabuleiro marcar uma linha
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
 * @return Retorna true se � possivel em algum lugar do tabuleiro marcar uma linha que 
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
 * Caso essa linha nao influencie nenhum outro quadrado retorne null
 */
Tabuleiro.prototype.marcaQualquerQuartaLinha = function() {
    
}
 


/**
* Marca no tabuleiro a quarta linha do quadrado passado por parametro
* @param cordX Coordenada x do quadrado
* @param coordY Coordenada y do quadrado
* @player "jogador" ou "computador" 
* @return Retorna um vetor que contem: na primeira posi��o o outro quadrado que essa 4a linha feita tambem influencia e
*  na segunda posi��o a quantidade de quadrados simultaneamente fechados ao se fazer essa quarta linha (pode ser 1 ou 2)
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
        if (quadradosDaAresta.length > 1) { // Espera-se que quando quadrados.length > 1, quadrados possua aresta interna (ou seja, as que nao circundam o tabuleiro) que � o que queremos testar.
            for (var i in quadradosDaAresta) {
                if (!isEqual(quadradosDaAresta[i],[cordX, cordY])) {
                    ret.quadradoInfluenciado = quadradosDaAresta[i];
                    if (this.podeFechar(ret.quadradoInfluenciado[0],ret.quadradoInfluenciado[1])) {
                        ret.qtdFechadosSimultaneamente = 2;                        
                    }               
               }
            }            
            this.marcaArestas(arestaAmarcar,player);
        }                      
        return ret;
    }
    return null;    
}

