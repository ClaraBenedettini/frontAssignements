import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Assignment } from '../assignment.model';
import { Subject, SubjectsService } from 'src/app/shared/subjects.service';

@Component({
  selector: 'app-assignments-details',
  templateUrl: './assignments-details.component.html',
  styleUrls: ['./assignments-details.component.css'],
})
export class AssignmentsDetailsComponent implements OnInit {
  assignmentTransmis!: Assignment | undefined;
  matiereConcernee!: Subject;

  constructor(
    private assignmentService: AssignmentsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private subjectsService: SubjectsService,
  ) { }

  ngOnInit(): void {
    this.getAssignment();
  }

  getAssignment() {
    const id = this.route.snapshot.params['id'];
    this.assignmentService.getAssignment(id).subscribe((assignment) => {
      if (assignment) {
        this.assignmentTransmis = assignment;
        assignment.matiere;
        this.subjectsService.getSubject(assignment.matiere).subscribe((subject) => {
          if (subject) {
            this.matiereConcernee = subject;
            console.log("Matiere : ", this.matiereConcernee)
          }
        });
      }
    });
  }

  onAssignmentRendu() {
    if (!this.assignmentTransmis) return;

    this.assignmentTransmis.etat = true;

    this.assignmentService
      .updateAssignment(this.assignmentTransmis)
      .subscribe((message) => {
        console.log(message);
        this.router.navigate(['/home']);
      });
  }

  onDelete() {
    if (!this.assignmentTransmis) return;

    this.assignmentService
      .deleteAssignement(this.assignmentTransmis._id)
      .subscribe((message) => {
        console.log(message);
        this.assignmentTransmis = undefined;
        this.router.navigate(['/home']);
      });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
