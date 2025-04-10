package com.universidade.controller;

import com.universidade.dto.PessoaDTO;
import com.universidade.entity.Pessoa;
import com.universidade.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pessoas")
public class PessoaController {

    @Autowired
    private PessoaRepository pessoaRepository;

    @PostMapping
    public ResponseEntity<Pessoa> criarPessoa(@RequestBody PessoaDTO pessoaDTO) {
        Pessoa pessoa = new Pessoa();
        pessoa.setNome(pessoaDTO.getNome());
        pessoa.setCpf(pessoaDTO.getCpf());
        pessoa.setIdade(pessoaDTO.getIdade());

        Pessoa salva = pessoaRepository.save(pessoa);
        return ResponseEntity.ok(salva);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pessoa> buscarPorId(@PathVariable Long id) {
        return pessoaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}