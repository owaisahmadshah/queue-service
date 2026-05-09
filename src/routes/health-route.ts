import { Router, type Request, type Response } from "express"

const router = Router()

router.get("/", (req: Request, res: Response) => res.status(200).send("OK"))

export { router as health_router }
