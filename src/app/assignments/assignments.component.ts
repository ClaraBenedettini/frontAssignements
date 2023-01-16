import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, merge, startWith, switchMap, of as observableOf, BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { Subject, SubjectsService } from 'src/app/shared/subjects.service';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit, AfterViewInit {
  assignments!: Assignment[];
  subjects!: Subject[];
  displayedColumns: string[] = ['nom', 'matiere', 'dateLimite', 'formationConcernee', 'etat'];
  page: number = 1;
  limit: number = 10;
  defaultItemsPerPage: number = 10;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  nameFilter = "";
  renduFilter: number = 0;
  promotionFilter: String = "";
  matiereFilter: String = "";

  dataSource: MatTableDataSource<Assignment> = new MatTableDataSource<Assignment>();


  constructor(private assignmentsService: AssignmentsService, private AuthService: AuthService, private router: Router, private subjectService: SubjectsService) { }

  ngOnInit(): void {
    this.subjectService.getSubjects().subscribe((subjects) => {
      if (subjects) {
        this.subjects = subjects;
      }
    });
  }

  ngAfterViewInit() {
    this.loadData();
    this.dataSource.sort = this.sort;
  }

  loadData() {
    this.paginator.page
      .pipe(startWith({}),
        switchMap(() => {
          return this.assignmentsService.getAssignmentsPagines(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.nameFilter,
            this.renduFilter,
            this.promotionFilter,
            this.matiereFilter)
        }),
        map(data => {
          this.paginator.length = data.totalDocs;
          return data.docs;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => {
        data.forEach((assignment: Assignment) => {
          this.subjects.forEach((subject: Subject) => {
            if (assignment.matiere === subject._id) {
              assignment.nomMatiere = subject.libelle.toString();
            }
          });
        });
        this.dataSource.data = data
      });


  }

  navigateTo(assignmentId: string) {
    console.log(assignmentId);
    this.router.navigate([`assignment`, assignmentId]);
  }

  callApi() {
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  applyFilter(event: Event) {
    const nameFilterValue = (event.target as HTMLInputElement).value;
    this.nameFilter = nameFilterValue;
    this.callApi();
  }

  setPromotionFilter(promotionFilterValue: String) {
    this.promotionFilter = promotionFilterValue;
    this.callApi();
  }

  setMatiereFilter(matiereFilterValue: String) {
    this.matiereFilter = matiereFilterValue;
    this.callApi();
  }

  setRenduFilter(renduFilterValue: number) {
    this.renduFilter = renduFilterValue;
    this.callApi();
  }

  isAdmin(): boolean {
    return this.AuthService.isAdmin();
  }

}