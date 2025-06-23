import dotenv from 'dotenv';
import logger from '../config/logger.js';

dotenv.config();


const appSetup = (app) => {
  try {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        logger.info(`Server is running on http://localhost:${PORT}`);
      });
  } catch (error) {
    logger.error("Error in appSetup");
    console.log(error);
  }
}

export default appSetup;