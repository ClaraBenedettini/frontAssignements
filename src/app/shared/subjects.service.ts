import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { Observable, of } from 'rxjs';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';

export class Subject {
    _id!: String;
    prof!: String;
    libelle!: String;
    img_prof!: String;
    img_matiere!: String;
}

@Injectable({
    providedIn: 'root'
})
export class SubjectsService {

    constructor(
        private http: HttpClient) { }

    // uri = "http://localhost:8010/api/subjects";
    uri = "https://api-angular.onrender.com/api/subjects";


    getSubject(id: String): Observable<Subject> {
        return this.http.get<Subject>(this.uri + '/' + id);
    }

    getSubjects(): Observable<Subject[]> {
        return this.http.get<Subject[]>(this.uri);
    }
}