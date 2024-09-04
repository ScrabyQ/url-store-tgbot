import { Scene, SceneEnter, Ctx, On, Message, Command } from 'nestjs-telegraf';
import { UuidService } from 'nestjs-uuid';
import { DELETE_LINK_SCENE, START_SCENE } from 'src/app.constants';
import { Context } from 'src/interfaces/context.interface';
import {
  addedLinkInvalid,
  requestToDelete,
  invalidCode,
  successfullyDeleted,
} from 'src/app.messages';
import { UrlService } from 'src/repository/url/url.service';

@Scene(DELETE_LINK_SCENE)
export class DeleteScene {
  constructor(
    private readonly urlService: UrlService,
    private readonly uuidService: UuidService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply(requestToDelete);
  }

  @On('text')
  async onText(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!this.isValidCode(message)) {
      await ctx.reply(invalidCode);
      return;
    }

    const url = await this.urlService.getOwnByCode(ctx.from.id, message);

    if (!url) {
      await ctx.reply(addedLinkInvalid);
      return;
    }

    await this.urlService.deleteOne(url.id);

    await ctx.reply(successfullyDeleted);
    await ctx.scene.enter(START_SCENE);
  }

  @Command('start')
  async returnToStartScene(@Ctx() ctx: Context) {
    await ctx.scene.enter(START_SCENE);
  }

  private isValidCode(code: string) {
    return this.uuidService.validate(code);
  }
}
