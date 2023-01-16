import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Subject, SubjectsService } from 'src/app/shared/subjects.service';
import { AssignmentsComponent } from '../assignments/assignments.component';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  promotions = ['L3', 'M1', 'M2']
  matieres !: Subject[];
  filtre: number = 0;
  devoirRendu!: boolean;
  constructor(private assignementComponent: AssignmentsComponent, private AuthService: AuthService, private assignmentsService: AssignmentsService, private subjectsService: SubjectsService) { }

  ngOnInit(): void {
    this.subjectsService.getSubjects().subscribe((subjects) => {
      if (subjects) {
        this.matieres = subjects;
      }
    });
  }

  isLogged(): boolean {
    return this.AuthService.isLogged();
  }

  isAdmin(): boolean {
    return this.AuthService.isAdmin();
  }

  changeFilter(eventValue: number) {
    this.filtre = eventValue;
    this.assignementComponent.setRenduFilter(eventValue);
  }

  changeMatiere(eventValue: string) {
    this.assignementComponent.setMatiereFilter(eventValue);
  }

  changePromotion(eventValue: string) {
    console.log(eventValue);
    this.assignementComponent.setPromotionFilter(eventValue);
  }



}
