<?php
    defined('BASEPATH') OR exit('No direct script access allowed');

    class Contas extends CI_Controller {
        public function __construct()
        {
            parent::__construct();
            $this->load->model('model_contas', 'contas');
            header('Content-Type: application/json');
            // $this->load->helper('url_helper');
            
        }

        public function index()
        {
            echo "Index";
        }

        public function geral()
        {
            $resultado = $this->contas->totalGeral();
            if ($resultado) {
                $this->mensagem(["Description" => "Success", "Response" => $resultado, "Status" => 200]);
            } else {
                $this->mensagem(["Description" => "Not Found", "Response" => "Nada foi encontrado.", "Status" => 404]);
            }
        }

        public function geralParcial()
        {
            $dataInicial =  $this->validaData( htmlspecialchars($_GET["data_inicial"]) );
            $dataFinal =  $this->validaData( htmlspecialchars($_GET["data_final"]) );
            $resultado = $this->contas->totaParcial($dataInicial, $dataFinal);

            if (empty($resultado) !== true) {
                $this->mensagem(["Description" => "Success", "Response" => $resultado, "Status" => 200]);
            } else {
                $this->mensagem(["Description" => "Not Found", "Response" => "Nada foi encontrado. ", "Status" => 404]);
            }
        }

        public function contasApagar()
        {
            $resultado = $this->contas->verContasApagar();
            if (empty($resultado) !== true) {
                $this->mensagem(["Description" => "Success", "Response" => $resultado, "Status" => 200]);
            } else {
                $this->mensagem(["Description" => "Not Found", "Response" => "Nada foi encontrado. ", "Status" => 404]);
            }
        }

        public function ver() 
        {
            $resultApagar = $this->contas->verContasApagar();
            $resultAreceber = $this->contas->verContasAreceber();
            $resultado = array_merge($resultApagar,$resultAreceber);
            
            if (empty($resultado) !== true) {
                $this->mensagem(["Description" => "Success", "Response" => $resultado, "Status" => 200]);
            } else {
                $this->mensagem(["Description" => "Not Found", "Response" => "Nada foi encontrado. ", "Status" => 404]);
            }
        }

        public function incluir() 
        {
            $tipo = $this->validaTipo( htmlspecialchars($_POST["tipo"]) );
            $valor =  $this->validaValor( htmlspecialchars($_POST["valor"]) );

            if ($tipo === "pagar") 
            {
                $dados = Array("valor" => $valor);
                $resultado = $this->contas->incluirContaPagar($dados);

                if ($resultado) $this->mensagem(["Description" => "Success", "Response" => "Transacao: Valor a pagar", "Status" => 200]);
                else $this->mensagem(["Description" => "Error", "Response" => "Nao foi possivel salvar os dados. Contate o suporte.", "Status" => 500]);

            } else if ($tipo === "receber") {
                $dados = Array("valor" => $valor);
                $resultado = $this->contas->incluirContaReceber($dados);

                if ($resultado) $this->mensagem(["Description" => "Success", "Response" => "Transacao: Valor a receber","Status" => 200]);
                else $this->mensagem(["Description" => "Error", "Response" => "Nao foi possivel salvar os dados. Contate o suporte.", "Status" => 500]);

            } else {
                return $this->mensagem(["Description" => "Error", "Response" => "Erro desconhecido. Contate o suporte.", "Status" => 404]);
            }

        }

        public function editar() 
        {
            $id = $this->validaID( htmlspecialchars($_POST["id"]) );
            $tipo = $this->validaTipo( htmlspecialchars($_POST["tipo"]) );
            $valor =  $this->validaValor( htmlspecialchars($_POST["valor"]) );

            if ($tipo === "pagar") 
            {
                $dados = Array("valor" => $valor, "id" => $id);
                $resultado = $this->contas->editarContaApagar($dados);

                if ($resultado) $this->mensagem(["Description" => "Success", "Response" => "Transacao: Valor a pagar foi alterado.","Status" => 200]);
                else $this->mensagem(["Description" => "Error", "Response" => "Nao foi possivel alterar os dados. Contate o suporte.", "Status" => 500]);

            } else if ($tipo === "receber") {
                $dados = Array("valor" => $valor, "id" => $id);
                $resultado = $this->contas->editarContaAreceber($dados);

                if ($resultado) $this->mensagem(["Description" => "Success", "Response" => "Transacao: Valor a receber foi alterado.","Status" => 200]);
                else $this->mensagem(["Description" => "Error", "Response" => "Nao foi possivel alterar os dados. Contate o suporte.", "Status" => 500]);

            } else {
                return $this->mensagem(["Description" => "Error", "Response" => "Erro desconhecido. Contate o suporte.", "Status" => 404]);
            }
        }

        private function mensagem($txt) 
        {
            die(json_encode($txt));
        }

        private function validaData($date)
        {
            $data = DateTime::createFromFormat('Y-m-j', $date);
            $data = $data->format('Y-m-d');

            if (preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $data) === 0 ) 
            {
                return $this->mensagem(["Description" => "Not Acceptable", "Response" => "Formato de data invalido. Experimente '2019-02-02'.", "Status" => 406]);
            } else if (preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $data) === FALSE)
            {
                return $this->mensagem(["Description" => "Error", "Response" => "Algo inesperado aconteceu durante a verificacao do DATA informada. Contate o suporte.", "Status" => 500]);
            }

            return $data;
        }

        private function validaID($id)
        {
            if (preg_match('/^([\d]+)$/', $valor) === 0)
            {
                return $this->mensagem(["Description" => "Not Acceptable", "Response" => "Apenas valores inteiros, sao permitidos para o ID.", "Status" => 406]);
            } else if (preg_match('/^([\d]+)$/', $valor) === FALSE)
            {
                return $this->mensagem(["Description" => "Error", "Response" => "Algo inesperado aconteceu durante a verificacao do ID informado. Contate o suporte.", "Status" => 500]);
            }

            return $id;
        }

        private function validaValor($valor)
        {
            if(preg_match('/^([\d.,]+)$/', $valor) === 0)
            {
                return $this->mensagem(["Description" => "Not Acceptable", "Response" => "Apenas valores inteiros, com ou sem decimais, sao permitidos.", "Status" => 406]);
            } else if (preg_match('/^([\d.,]+)$/', $valor) === FALSE)
            {
                return $this->mensagem(["Description" => "Error", "Response" => "Algo inesperado aconteceu durante a verificacao do valor informado. Contate o suporte.", "Status" => 500]);
            }

            return $valor;
        }

        private function validaTipo($tipo)
        {
            // Se não for exatamente 'pagar' ou 'receber' não valida.
            if(preg_match('/(\W|^)pagar|receber(\W|$)/', $tipo) === 0)
            {
                return $this->mensagem(["Description" => "Not Acceptable", "Response" => "Apenas valores 'pagar' ou 'receber' sao permitidos.", "Status" => 406]);
            } else if (preg_match('/(\W|^)pagar|receber(\W|$)/', $tipo) === FALSE)
            {
                return $this->mensagem(["Description" => "Error", "Response" => "Algo inesperado aconteceu durante a verificacao do tipo informado. Contate o suporte.", "Status" => 500]);
            }

            return $tipo;
        }
    }
