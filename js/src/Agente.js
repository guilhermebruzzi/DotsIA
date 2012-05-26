function Malha(_linhas, _colunas, _jogadas_computador, _jogadas_pessoa){
	this.linhas = _linhas;
	this.colunas = _colunas;
	this.jogadas_pessoa = _jogadas_pessoa;
	this.jogadas_computador = _jogadas_computador;
}

function Agente(){
}

Agente.prototype.jogadaComputador = function(malha){
	for (var i=1;i<= ((malha.colunas-1)*malha.linhas)+((malha.linhas-1)*malha.colunas);i++){
		tem = 0;
		for (temp in malha.jogadas_pessoa){
			temp = parseInt(malha.jogadas_pessoa[temp], 10);
			if (i==temp){
				tem = 1;
			}
		}
		for (temp in malha.jogadas_computador){
			temp = parseInt(malha.jogadas_computador[temp], 10);
			if (i==temp){
				tem = 1;
			}
		}
		if (tem==0){
			return i;
		}
	}
	return 0;
}	
