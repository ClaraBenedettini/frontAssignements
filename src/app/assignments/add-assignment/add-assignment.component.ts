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
  matieres !:Subject[];
  promotionSelectionnee!: string;
  matiereSelectionnee!: string;
  constructor(private subjectsService: SubjectsService, private assignementComponent: AssignmentsComponent, private assignmentsService:AssignmentsService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.subjectsService.getSubjects().subscribe((subjects) => {
      if (subjects) {
        this.matieres = subjects;
      }
    });
  }

  onSubmit() {
    console.log(this.nom + ' a rendre le ' + this.dateLimite);
    const newAssignment = new Assignment();
    newAssignment.nom = this.nom;
    newAssignment.dateLimite = this.dateLimite;
    newAssignment.formationConcernee = this.promotionSelectionnee;
    newAssignment.matiere = this.matiereSelectionnee;
    newAssignment.etat = false;
    console.log(newAssignment);
    this.assignmentsService.addAssignment(newAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);
      });
  }

  changeMatiere(eventValue: string) {
    this.matiereSelectionnee = eventValue;
  }

  changePromotion(eventValue: string) {
    this.promotionSelectionnee = eventValue;
  }

  durationInSeconds = 5;

  openSnackBar() {
    this._snackBar.open('Nouveau devoir ajouté', 'Fermer', {
      duration: this.durationInSeconds * 1000,
    });
  }
}
