import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { allowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { ReviewService } from "src/services/review/review.service";

@Controller('api/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(RoleCheckerGuard)
  @allowToRoles('user')
  async createReview(
    @Req() req: any, 
    @Body() data: { petId: number; comment: string; rating: number },
  ) {
    const userId = req.token.id;
    return await this.reviewService.createReview(userId, data.petId, data.rating, data.comment);
  }

  @Get('all')
  @UseGuards(RoleCheckerGuard)
  @allowToRoles('user')
  async getAllReviews(@Query('petId') petId?: number) {
    return await this.reviewService.getAllReviews(petId); 
  }
}
