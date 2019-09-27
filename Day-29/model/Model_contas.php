<?php
class Model_contas extends CI_Model {

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function totaParcial($dataInicial, $dataFinal)
    {
        $total_apagar = 0;
        $total_receber = 0;
        $geral = 0;

        // Total a Pagar
        $sql_1 = "SELECT SUM(a_pagar) as total_apagar FROM contas WHERE a_pagar IS NOT NULL ";
        $sql_1 .= "AND data BETWEEN ('".$dataInicial."') AND ('".$dataFinal."');";
        $query_1 = $this->db->query($sql_1);
        $row_1 = $query_1->row_array();

        if (isset($row_1['total_apagar']))
        {
            $total_apagar = $row_1['total_apagar'];
        } // === FIM a Pagar

        // Total a Receber
        $sql_2 = "SELECT SUM(a_receber) as total_areceber FROM contas WHERE a_receber IS NOT NULL ";
        $sql_2 .= "AND data BETWEEN ('".$dataInicial."') AND ('".$dataFinal."');";
        $query_2 = $this->db->query($sql_2);
        $row_2 = $query_2->row_array();
        
        if (isset($row_2['total_areceber']))
        {
            $total_receber = $row_2['total_areceber'];
        } // === FIM a Receber

        $geral = ($total_receber - $total_apagar);
        return $geral;
    }

    public function totalGeral(): float
    {
        $total_apagar = 0;
        $total_receber = 0;
        $geral = 0;

        // Total a Pagar
        $sql_1 = "SELECT SUM(a_pagar) as total_apagar FROM contas WHERE a_pagar IS NOT NULL;";
        $query_1 = $this->db->query($sql_1);
        $row_1 = $query_1->row_array();
        
        if (isset($row_1['total_apagar']))
        {
            $total_apagar = $row_1['total_apagar'];
        } // === FIM a Pagar

        // Total a Receber
        $sql_2 = "SELECT SUM(a_receber) as total_areceber FROM contas WHERE a_receber IS NOT NULL;";
        $query_2 = $this->db->query($sql_2);
        $row_2 = $query_2->row_array();
        
        if (isset($row_2['total_areceber']))
        {
            $total_receber = $row_2['total_areceber'];
        } // === FIM a Receber

        $geral = ($total_receber - $total_apagar);
        return $geral;
    }

    public function verContasApagar(): array
    {
        $sql = "SELECT id, a_pagar, data FROM contas ";
        $sql .= "WHERE a_pagar IS NOT NULL";
        $query = $this->db->query($sql);
        $result = Array();
        $indice = 0;

        foreach ($query->result_array() as $row)
        {
            $result[$indice]['id'] = $row['id'];
            $result[$indice]['a_pagar'] = $row['a_pagar'];
            $result[$indice]['data'] = $row['data'];
            $indice += 1;
        }

        return $result;
    }

    public function verContasAreceber()
    {
        $sql = "SELECT id, a_receber, data FROM contas ";
        $sql .= "WHERE a_receber IS NOT NULL";
        $query = $this->db->query($sql);
        $result = Array();
        $indice = 0;

        foreach ($query->result_array() as $row)
        {
            $result[$indice]['id'] = $row['id'];
            $result[$indice]['a_receber'] = $row['a_receber'];
            $result[$indice]['data'] = $row['data'];
            $indice += 1;
        }

        return $result;
    }

    public function incluirContaPagar($dados): bool
    {
        $sql = "INSERT INTO contas SET "; 
        $sql .= "a_pagar = ".$dados['valor'].", ";
        $sql .= "data = NOW();";
        $this->db->query($sql);
       
        if ($this->db->affected_rows() > 0) {
            return true;
        }

        return false;
    }

    public function incluirContaReceber($dados): bool
    {
        $sql = "INSERT INTO contas SET "; 
        $sql .= "a_receber = ".$dados['valor'].", ";
        $sql .= "data = NOW()";
        $this->db->query($sql);
        
        if ($this->db->affected_rows() > 0) {
            return true;
        }

        return false;
    }

    public function editarContaApagar($dados): bool
    {
        $sql = "UPDATE contas ";
        $sql .= "SET a_pagar=".$dados['valor'].", ";
        $sql .= "WHERE id=".$dados['id'].";";
        $query = $this->db->query($sql);
        
        if ($this->db->affected_rows() > 0) {
            return true;
        }

        return false;
    }

    public function editarContaAreceber($dados): bool
    {
        $sql = "UPDATE contas ";
        $sql .= "SET a_receber=".$dados['valor'].", ";
        $sql .= "WHERE id=".$dados['id'].";";
        $query = $this->db->query($sql);
        
        if ($this->db->affected_rows() > 0) {
            return true;
        }

        return false;
    }
}