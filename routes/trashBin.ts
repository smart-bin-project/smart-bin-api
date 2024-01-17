import express from 'express';
import { Request, Response } from 'express';
import { MongoDBConnection } from '../services/db_connection/mdb_connection.ts';
import { MongoDBSmartBinService } from '../services/db_connection/trashBin.ts';

const SmartBinRouter = express.Router();

const SmartBinService = new MongoDBSmartBinService(new MongoDBConnection());

// Route to create a new smart bin
SmartBinRouter.post('/smartbins', async (req: Request, res: Response) => {
  try {
    const { fullTime, emptyTime, binNumber } = req.body; // Assuming the request body contains smart bin data
    const createdSmartBin = await SmartBinService.createSmartBin(fullTime, emptyTime, binNumber);
    res.status(201).json(createdSmartBin);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Error creating a new smart bin' });
  }
});

// Route to get all smart bins
SmartBinRouter.get('/smartbins', async (_req: Request, res: Response) => {
  try {
    const allSmartBins = await SmartBinService.getAllSmartBins();
    res.json(allSmartBins);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Error fetching smart bins' });
  }
});

// Route to find a smart bin by binNumber
SmartBinRouter.get('/smartbins/:binNumber', async (req: Request, res: Response) => {
  try {
    const { binNumber } = req.params;
    const smartBin = await SmartBinService.getSmartBinByNumber(parseInt(binNumber, 10));
    if (!smartBin) {
      return res.status(404).json({ message: 'Smart bin not found' });
    }
    res.json(smartBin);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Error finding smart bin' });
  }
});

// Route to update full time of a smart bin
SmartBinRouter.put('/smartbins/:binNumber/fullTime', async (req, res) => {
  try {
    const { binNumber } = req.params;
    const { fullTime } = req.body;
    const updatedSmartBin = await SmartBinService.updateFullTimeByNumber(parseInt(binNumber, 10), fullTime);
    
    if (updatedSmartBin) {
      res.status(200).json(updatedSmartBin);
    } else {
      res.status(404).json({ message: 'Smart bin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating full time' });
  }
});

// Route to update empty time of a smart bin
SmartBinRouter.put('/smartbins/:binNumber/emptyTime', async (req, res) => {
  try {
    const { binNumber } = req.params;
    const { emptyTime } = req.body;
    const updatedSmartBin = await SmartBinService.updateEmptyTimeByNumber(parseInt(binNumber, 10), emptyTime);
    
    if (updatedSmartBin) {
      res.status(200).json(updatedSmartBin);
    } else {
      res.status(404).json({ message: 'Smart bin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating empty time' });
  }
});

// Route to delete a smart bin by binNumber
SmartBinRouter.delete('/smartbins/:binNumber', async (req: Request, res: Response) => {
    try {
      const { binNumber } = req.params;
      const deleted = await SmartBinService.deleteSmartBinByNumber(parseInt(binNumber, 10));
  
      if (deleted) {
        res.status(204).end(); // Successfully deleted, return 204 No Content
      } else {
        res.status(404).json({ message: 'Smart bin not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting smart bin' });
    }
  });  

export default SmartBinRouter;
