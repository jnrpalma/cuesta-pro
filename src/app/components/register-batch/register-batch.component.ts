import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoDynamicModule, PoDynamicFormField, PoButtonModule, PoNotificationService, PoLoadingModule } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';

@Component({
  selector: 'app-register-batch',
  standalone: true,
  imports: [CommonModule, FormsModule, PoButtonModule, PoDynamicModule, PoLoadingModule],
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
    { property: 'lote', label: 'Nome do Lote', gridColumns: 12, required: true },
    { 
      property: 'categoria', 
      label: 'Categoria do Lote', 
      type: 'select', 
      options: [
        { label: 'Categoria 1', value: 'categoria1' },
        { label: 'Categoria 2', value: 'categoria2' },
        { label: 'Categoria 3', value: 'categoria3' },
        { label: 'Categoria 4', value: 'categoria4' },
        { label: 'Categoria 5', value: 'categoria5' }
      ],
      gridColumns: 12, 
      required: true 
    }
  ];

  constructor(
    private animalService: AnimalService,
    private poNotification: PoNotificationService
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
}
