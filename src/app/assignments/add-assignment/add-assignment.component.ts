import { Component, OnInit } from '@angular/core';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, SubjectsService } from 'src/app/shared/subjects.service';
import { AssignmentsComponent } from '../assignments.component';


@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  nom: string = '';
  dateLimite!: Date;
  promotions = ['L3', 'M1', 'M2']
  matiere !:Subject[];
  constructor(private subjectsService: SubjectsService, private assignementComponent: AssignmentsComponent, private assignmentsService:AssignmentsService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.subjectsService.getSubjects().subscribe((subjects) => {
      if (subjects) {
        this.matiere = subjects;
      }
    });
  }

  onSubmit() {
    console.log(this.nom + ' a rendre le ' + this.dateLimite);
    const newAssignment = new Assignment();
    newAssignment.nom = this.nom;
    newAssignment.dateLimite = this.dateLimite;
    // newAssignment.formationConcernee = this.promotions.toString();
    // newAssignment.nomMatiere = this.matiere[0].toString();
    newAssignment.etat = false;

    this.assignmentsService.addAssignment(newAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);
      });
  }

  changeMatiere(eventValue: string) {
    this.assignementComponent.setMatiereFilter(eventValue);
  }

  changePromotion(eventValue: string) {
    console.log(eventValue);
    this.assignementComponent.setPromotionFilter(eventValue);
  }

  durationInSeconds = 5;

  openSnackBar() {
    this._snackBar.open('Nouveau devoir ajouté', 'Fermer', {
      duration: this.durationInSeconds * 1000,
    });
  }
}
