import { Request, Response } from "express";
import { UserService } from '../services/user.service';
import { onError } from '../utils/on-error.util';

export class UsersControler {
  public static async create(req: Request, res: Response) {
    try {
      let { name, email, username, password } = req.body;

      const service = new UserService();
      const data = await service.createUser({
        name,
        email,
        username,
        password
      })
      
      return res.status(200).json({
        ok: true,
        message: "Usuário criado com sucesso!",
        data
      });
    } catch (err) {
      return onError(err, res)
    }
  }
  
  public static async list(_: Request, res: Response) {
    try {
      const service = new UserService()
      const users = await service.listUsers();

      return res.status(200).json({
        ok: true,
        message: "Usuário listado com sucesso!",
        user: users,
      });
    } catch (err) {
      return onError(err, res)
    }
  }
 
  public static async update(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { name, username, password } = req.body;

      const service = new UserService()
      const userUpdated = await service.updateUser({
        userId,
        name,
        password,
        username
      })

      return res.status(200).json({
        ok: true,
        message: "Usuário atualizado com sucesso!",
        user: userUpdated,
      });
    } catch (err) {
      return onError(err, res)
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      const userId  = req.params.id;

      const service = new UserService();
      const userDeleted = await service.deleteUser(userId)

      return res.status(200).json({
        ok: true,
        messagem: "Usuário deletado com sucesso!",
        userDeleted,
      });
    } catch (err) {
      return onError(err, res)
    }
  }
}
