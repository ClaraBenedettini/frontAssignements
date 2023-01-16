import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentsComponent } from '../assignments.component';
import { Subject, SubjectsService } from 'src/app/shared/subjects.service';



@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css'],
})
export class EditAssignmentComponent implements OnInit {
  assignment!: Assignment | undefined;
  nom: string = '';
  dateLimite!: Date;
  promotions = ['L3', 'M1', 'M2']
  matieres !: Subject[];
  promotionSelectionnee!: string;
  matiereSelectionnee!: string;
  notes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  noteSelectionnee!: Number;
  etat!: Boolean;
  remarque!: string;
  nomEleve!: string;

  constructor(
    private assignmentsService: AssignmentsService,
    private subjectService: SubjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.subjectService.getSubjects().subscribe((subjects) => {
      if (subjects) {
        this.matieres = subjects;
      }
    });
    this.getAssignment();
  }
  getAssignment() {
    // on récupère l'id dans le snapshot passé par le routeur
    // le "+" force l'id de type string en "number"
    const id = this.route.snapshot.params['id'];

    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      if (!assignment) return;
      this.assignment = assignment;
      // Pour pré-remplir le formulaire
      this.nom = assignment.nom;
      this.dateLimite = assignment.dateLimite;
      this.matiereSelectionnee = assignment.matiere;
      this.promotionSelectionnee = assignment.formationConcernee.toString();
      this.noteSelectionnee = assignment.note;
      this.etat = assignment.etat;
      this.remarque = assignment.remarque;
      this.nomEleve = assignment.nomEleve;

    });
  }
  onSaveAssignment() {
    if (!this.assignment) return;

    // on récupère les valeurs dans le formulaire
    const assignment = new Assignment();
    assignment._id = this.route.snapshot.params['id'];
    assignment.nom = this.nom;
    assignment.dateLimite = this.dateLimite;
    assignment.formationConcernee = this.promotionSelectionnee;
    assignment.matiere = this.matiereSelectionnee;
    assignment.etat = this.etat;
    assignment.nomEleve = this.nomEleve;
    assignment.note = this.noteSelectionnee;
    assignment.remarque = this.remarque;
    console.log(assignment);
    this.assignmentsService
      .updateAssignment(assignment)
      .subscribe((message) => {
        console.log(message);
        this.openSnackBar();
        this.getAssignment();
      });

  }

  changeNom(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.nom = event.target.value;
    }
  }

  changeEleve(event: Event) {
    console.log(event);
    if (event.target instanceof HTMLInputElement) {
      console.log(event.target.value);
      this.nomEleve = event.target.value;
    }
  }

  changeDate(eventValue: Date) {
    this.dateLimite = eventValue;
  }

  changeEtat() {
    this.etat = !this.etat;
  }

  changeMatiere(eventValue: string) {
    this.matiereSelectionnee = eventValue;
  }

  changePromotion(eventValue: string) {
    this.promotionSelectionnee = eventValue;
  }

  changeNote(eventValue: number) {
    this.noteSelectionnee = eventValue;
  }

  changeRemarque(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.remarque = event.target.value;
    }
  }


  durationInSeconds = 5;

  openSnackBar() {
    this._snackBar.open('Devoir modifié', 'Fermer', {
      duration: this.durationInSeconds * 1000,
    });
  }
}
