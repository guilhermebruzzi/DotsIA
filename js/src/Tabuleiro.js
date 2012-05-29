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
	        associa_quadrado_arestas(mapa_quadrados_arestas, mapa_arestas_quadrados, quadrado, arestas)
	    }
	}
	
	return [mapa_quadrados_arestas, mapa_arestas_quadrados]
}

function Tabuleiro(_linhas, _colunas, _marcadas, _quadradosJogador, _quadradosComputador){
	this.linhas = _linhas;
	this.colunas = _colunas;
	this.marcadas = (_marcadas === null) ? [] : _marcadas;
	this.quadradosJogador = (_quadradosJogador === null) ? [] : _quadradosJogador; // Lista de vetores: [ [cordX, cordY], ]
	this.quadradosComputador = (_quadradosComputador === null) ? [] : _quadradosComputador; // Lista de vetores: [ [cordX, cordY], ]
	var mapas = cria_mapa_arestas_quadrados(_linhas, _colunas);
	this.mapa_quadrados_arestas = mapas[0];
	this.mapa_arestas_quadrados = mapas[1];
}

Tabuleiro.prototype.clone = function(){
    return new Tabuleiro(this.linhas, this.colunas, this.marcadas, this.quadradosJogador, this.quadradosComputador);
}

Tabuleiro.prototype.arestaMarcada = function(aresta){
    return ($.inArray(aresta, this.marcadas) !== -1); // $.inArray retorna -1 se não achou
}

Tabuleiro.prototype.quadradoMarcado = function(quadrado){
    return ($.inArray(quadrado, this.quadradosJogador) !== -1) || ($.inArray(quadrado, this.quadradosComputador) !== -1); // $.inArray retorna -1 se não achou
}

Tabuleiro.prototype.marca = function(array_interno, valores_a_serem_marcados){
    if(typeof(valores_a_serem_marcados) == "number"){ // Apenas um elemento
        valores_a_serem_marcados = [valores_a_serem_marcados];
    }
    $.merge(array_interno, valores_a_serem_marcados);
}

Tabuleiro.prototype.marcaArestas = function(arestas, player){
    while(arestas.length > 0){
        var aresta = arestas.pop();
        this.marca(this.marcadas, aresta);
        var quadrados = []
        for (quadrado_index in this.mapa_arestas_quadrados[aresta]){
            var quadrado = quadrados[quadrado_index];
            if(this.quadradoEstaCompleto(quadrado[0], quadrado[1])){
                quadrados.append(quadrado);
            }
        }
        
        if(quadrados.length > 0){ // Continuar com uma aresta aleatória
            if(player == "computador"){
                this.addQuadradosComputador(quadrados);
            }
            else{
                this.addQuadradosJogador(quadrados);
            }
        
            arestas.push(Math.floor((Math.random()*(_linhas*_colunas)) + 1));
        }
    }
}

Tabuleiro.prototype.addQuadradosJogador = function(novosQuadrados){
    if(typeof(novosQuadrados[0]) == "number"){ // Apenas um quadrado e não uma lista de quadrados
        novosQuadrados = [ novosQuadrados ]
    }
    this.marca(this.quadradosJogador, novosQuadrados);
}

Tabuleiro.prototype.addQuadradosComputador = function(novosQuadrados){
    if(typeof(novosQuadrados[0]) == "number"){ // Apenas um quadrado e não uma lista de quadrados
        novosQuadrados = [ novosQuadrados ]
    }
    this.marca(this.quadradosComputador, novosQuadrados);
}

Tabuleiro.prototype.getQuadradoArestas = function(cordX, cordY){
    return this.mapa_arestas_quadrados[chave_quadrado([cordX, cordY])]    
}

Tabuleiro.prototype.quadradoEstaCompleto = function(cordX, cordY){
    var arestas = this.getQuadrado(cordX, cordY);
    var countPreenchido = 0;
    for(aresta_index in arestas){
        var aresta = arestas[aresta_index];
        if(this.arestaMarcada(aresta)){
            countPreenchido++;
        }
    }
    return (countPreenchido == 4);
}

