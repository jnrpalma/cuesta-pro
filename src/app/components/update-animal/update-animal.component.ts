import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalService } from '../../services/animal/animal.service';
import { Animal } from '../register-animal/interface/animal.interface';
import { PoNotificationService } from '@po-ui/ng-components';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-animal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-animal.component.html',
  styleUrls: ['./update-animal.component.css']
})
export class UpdateAnimalComponent implements OnInit {
  animalId!: string;
  animal: Animal = {} as Animal;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.animalId = params['id'];
      this.loadAnimal();
    });
  }

  loadAnimal(): void {
    this.animalService.getAnimalById(this.animalId).subscribe((animal: Animal) => {
      this.animal = animal;
      console.log('Animal carregado:', this.animal);
    });
  }

  onSubmit(form: any): void {
    if (form.valid) {
      this.animalService.updateAnimal(this.animal).then(() => {
        this.poNotification.success('Animal atualizado com sucesso!');
        this.router.navigate(['/dashboard/animais']);
      }).catch(error => {
        this.poNotification.error('Erro ao atualizar o animal: ' + error.message);
      });
    } else {
      this.poNotification.error('Por favor, preencha todos os campos obrigatórios.');
    }
  }
}
