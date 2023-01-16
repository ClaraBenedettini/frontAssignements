import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  login = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  showModal = false;
  error = false;
  errorMessage = '';


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  openModal(): void {
    console.log("test")
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  log(): void {
    console.log(this.login.value);
    console.log(this.password.value);
    if (!this.login.errors && !this.password.errors && this.login.value && this.password.value) {
      this.authService.logIn(this.login.value, this.password.value).subscribe((data) => {
        console.log(data);
        if (data) {
          this.authService.setLoggedIn(true);
          if(data.role === 'admin') {
            this.authService.setIsAdmin(true);
          }
          this.closeModal();
        }
      }, (err) => {
        console.log(err);
        this.error = true;
        this.errorMessage = err.error.message;
      }
      );
    }
  }

  disconnect(): void {
    this.authService.setLoggedIn(false);
    this.authService.setIsAdmin(false);
  }

  isLogged(): boolean {
    return this.authService.isLogged();
  }

}
