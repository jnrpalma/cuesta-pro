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
    quantidade: 0
  };
  
  isLoading = false;

  batchFields: Array<PoDynamicFormField> = [
    { property: 'lote', label: 'Nome do Lote', gridColumns: 12, required: true },
    { property: 'quantidade', label: 'Quantidade', type: 'number', gridColumns: 12, required: true }
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
      quantidade: 0
    };
  }
}
