import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoDynamicModule, PoDynamicFormField, PoButtonModule, PoNotificationService, PoLoadingModule, PoFieldModule  } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-register-batch',
  standalone: true,
  imports: [CommonModule, FormsModule, PoButtonModule, PoDynamicModule, PoLoadingModule, PoFieldModule ],
  templateUrl: './register-batch.component.html',
  styleUrls: ['./register-batch.component.css']
})
export class RegisterBatchComponent implements OnInit {
  showBatchForm: boolean = false;
  batchFormButtonLabel: string = 'Formulário de Cadastro de Lote';

  batchAnimal: any = {
    lote: '',
    categoria: ''
  };
  
  isLoading = false;

  batchFields: Array<PoDynamicFormField> = [
    { property: 'lote', label: 'Nome do Lote', gridColumns: 6, required: true },
    { 
      property: 'categoria', 
      label: 'Categoria do Lote', 
      type: 'select', 
      options: [], // Inicialmente vazio
      gridColumns: 6, 
      required: true 
    }
  ];

  newCategory: string = '';

  constructor(
    private animalService: AnimalService,
    private poNotification: PoNotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  toggleBatchForm() {
    this.showBatchForm = !this.showBatchForm;
    this.batchFormButtonLabel = this.showBatchForm ? 'Ocultar Formulário de Cadastro de Lote' : 'Formulário de Cadastro de Lote';
  }

  cadastrarLote() {
    this.poNotification.success('Cadastro de lote realizado com sucesso!');
  }

  restaurarBatchForm() {
    this.batchAnimal = {
      lote: '',
      categoria: ''
    };
  }

  adicionarCategoria() {
    if (this.newCategory.trim()) {
      const categoriaField = this.batchFields.find(field => field.property === 'categoria');
      if (categoriaField && categoriaField.options) {
        categoriaField.options.push({ label: this.newCategory, value: this.newCategory.toLowerCase().replace(/\s+/g, '') });
        this.newCategory = '';
        this.poNotification.success('Categoria adicionada com sucesso!');
        // Atualizar a lista de campos e forçar a detecção de mudanças
        this.batchFields = [...this.batchFields];
        this.cdr.detectChanges();
      }
    } else {
      this.poNotification.error('Por favor, insira um nome de categoria válido.');
    }
  }
}
