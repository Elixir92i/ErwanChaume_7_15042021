import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})

export class ProfileUpdateComponent implements OnInit {

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  updateForm: FormGroup;
  passwordForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  mode: string;
  loading: boolean;
  errorMsg: string;
  user: User;
  user_id: string;
  imagePreview: string;
  email = new FormControl('', [Validators.required, Validators.email]);


  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder) { }

  // Récupération des données user + création des forms
  ngOnInit() {
    this.user_id = this.auth.getUserId();
    this.route.params.subscribe(
      (params) => {
        this.auth.getUserById(this.auth.getUserId()).then(
          (user: User) => {
            this.user = user;
            this.initModifyForm(user);
            this.loading = false;
            this.initModifyPassword(user);
          }
        );
      }
    );
  }

  // Fonction ouverture suppression de compte
  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteAccountDialog, { restoreFocus: false });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  // Création du FormGroup des modifications du profil
  initModifyForm(user: User) {
    this.updateForm = this.formBuilder.group({
      firstname: [this.user.firstname, Validators.required],
      lastname: [this.user.lastname, Validators.required],
      image: [this.user.imageUrl, Validators.required],
      email: [this.user.email, Validators.required],
    });
  }

    // Création du FormGroup pour la modification du mot de passe
  initModifyPassword(user: User) {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });
  }

  // Fonction pour vérifier si les mots de passes sont identiques
  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  // Erreur si le mail est vide
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Ce champs doit être renseigné';
    }

    return this.email.hasError('email') ? 'Votre email est invalide' : '';
  }

  // Fonction de mise à jour du profil
  onUpdate() {
    this.loading = true;
    const updateUser = new User();
    updateUser.email = this.updateForm.get('email').value;
    updateUser.firstname = this.updateForm.get('firstname').value;
    updateUser.lastname = this.updateForm.get('lastname').value;
    updateUser.user_id = this.auth.getUserId();
    this.auth.updateUser(this.user.user_id, updateUser, this.updateForm.get('image').value).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.location.reload();
        this.router.navigate(['/user-profile']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        console.error(error);
        this.errorMsg = error.message;
      }
    );
  }

  // Fonction de mise à jour du mot de passe
  onUpdatePassword() {
    const updatePassword = new User();
    updatePassword.password = this.passwordForm.get('password').value;
    this.auth.updateUserPassword(this.user.user_id, updatePassword).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.location.reload();
        this.router.navigate(['/user-profile']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        console.error(error);
        this.errorMsg = error.message;
      }
    );
  }

  // Fonction pour l'image de profil (preview)
  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.updateForm.get('image').setValue(file);
    this.updateForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Fonction de retour au profil
  goBackProfile() {
    this.router.navigate(['/user-profile']);
  }
}

@Component({
  selector: 'DeleteAccountDialog',
  templateUrl: 'DeleteAccountDialog.html',
})

export class DeleteAccountDialog {

  loading: boolean;
  errorMsg: string;
  user: User;
  user_id: string;


  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) { }

  // Récupération des données user
  ngOnInit() {
    this.user_id = this.auth.getUserId();
    this.route.params.subscribe(
      (params) => {
        this.auth.getUserById(this.auth.getUserId()).then(
          (user: User) => {
            this.user = user;
            this.loading = false;
          }
        );
      }
    );
  }

  // Fonction de suppression de compte
  onDelete() {
    this.loading = true;
    this.auth.deleteUser(this.user.user_id).then(
      (response: { message: string }) => {
        this.loading = false;
        window.localStorage.clear();
        this.router.navigate(['/signup']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
        console.error(error);
      }
    );
  }
}
