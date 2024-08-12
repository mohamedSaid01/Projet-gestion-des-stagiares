import { query, Request, Response } from "express";
import Stagiare, { IStagiare } from "../database/models/stagiares";
import APIFeatures from "../helpers/apiFeatures";
import { AuthRequest } from "../helpers/authMiddleware";

export const createStagiare = async (req: AuthRequest, res: Response) => {
    try {
        console.log('retrieved user id', req.userId);
        const { username, email, password } = req.body;
        const newStagiare: IStagiare = new Stagiare({
            username, email, password, createdBy: req.userId
        });
        const savedStagiare:IStagiare = await newStagiare.save();

        res.status(200).json({
            message: 'Stagiare created successfully',
            data: savedStagiare,
        });
        
    } catch (error:any) {
    }
  };


export const getOneStagiareById = async (req:Request, res:Response): Promise<void> => {
    try{
        const {id} = req.params;
        const stagiare: IStagiare | null = await Stagiare.findById(id).populate('createdBy')
        if (!stagiare){
            res.status(404).json({
                error:'Stagiare not found'})
                return
        }
        res.status(200).json({
            message:'Stagiare retourned successfully',
            stagiare})
    }
    catch(error){
        res.status(400).json({
            error:'ERROR HAPPEN AT GET Stagiare By ID !!',
        })
    }
}

export const updateOneStagiareById = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;
        const data = req.body;
        if (Object.values(data).length===0) {
            res.status(200).json({
                message: 'Nothing to update'
            })
            return;
        }
        const updateStagiare = await Stagiare.findByIdAndUpdate(id, data)
        if (!updateStagiare) {
            res.status(404).json({
                error: 'Stagiare not found'
            });
        }
        res.status(200).json({
            status: 'Stagiare updated successfully',
            data: updateStagiare
        });
    } catch (error) {
        res.status(400).json({
            error: 'Error updating this stagiare',
        });
    }
};

export const deleteStagiare = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
      const deletedStagiare = await Stagiare.findByIdAndDelete(id);
      if (!deletedStagiare) {
        return res.status(404).json({ error: "Stagiare not found" });
      }
      res.status(200).json({
        message: "Stagiare deleted successfully",
        data: deletedStagiare,
      });
    } catch (error) {
      res.status(400).json({ error: "Error deleting this Stagiare" });
    }
  };

  export const getAllStagiares = async (req: Request, res: Response) => {
    try {
    //   const stagiares:IStagiare[] = await Stagiare.find();
    const {page = 1, limit = 5} = req.query;
    const options = {
        page:parseInt(page as string),
        limit: parseInt(limit as string)
    }
    let findAllQuery = Stagiare.find()
    const features = new APIFeatures(
        findAllQuery,
        req.query
    ).filter()
    .sort()
    .limitFields()
    .search(['username','email'])
    const stagiares = await Stagiare.paginate(features?.query, options);
      res.status(200).json({ message: "All stagiares retourned successfully", stagiares });
    } catch (error) {
      res.status(400).json({ error: "Error fetching stagiares" });
    }
  };


  export const getMyStagiares = async (req: AuthRequest, res: Response) => {
    try {
      const myStagiare = await Stagiare.find({createdBy: req.userId});
      res.status(200).json({
        message: "Stagiares retourned successfully",
        data: myStagiare,
      });
    } catch (error) {
      res.status(400).json({ error: "Error retourned stagiares" });
    }
  };




