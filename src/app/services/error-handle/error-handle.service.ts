import { Injectable } from "@angular/core";
import { PoNotificationService } from "@po-ui/ng-components";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandleService {

  constructor(private poNotification: PoNotificationService) {}

  handleLoginError(error: any) {
    let message = 'Ocorreu um erro ao tentar fazer login.';

    switch (error.code) {
      case 'auth/invalid-email':
        message = 'O email fornecido é inválido.';
        break;
      case 'auth/user-disabled':
        message = 'Esta conta foi desativada.';
        break;
      case 'auth/user-not-found':
        message = 'Usuário não encontrado. Verifique suas credenciais.';
        break;
      case 'auth/wrong-password':
        message = 'Senha incorreta. Tente novamente.';
        break;
      case 'auth/invalid-credential':
        message = 'As credenciais fornecidas são inválidas ou expiraram. Tente novamente.';
        break;
      default:
        message = 'Ocorreu um erro desconhecido. Tente novamente mais tarde.';
        break;
    }

    this.poNotification.error(message);
  }

  handleForgotPasswordError(error: any) {
    let message = 'Ocorreu um erro ao tentar redefinir a senha.';

    switch (error.code) {
      case 'auth/invalid-email':
        message = 'O email fornecido é inválido.';
        break;
      case 'auth/user-not-found':
        message = 'Usuário não encontrado. Verifique o email inserido.';
        break;
      default:
        message = 'Ocorreu um erro desconhecido. Tente novamente mais tarde.';
        break;
    }

    this.poNotification.error(message);
  }
}

