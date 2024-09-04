import { Scene, SceneEnter, Ctx, On, Message } from 'nestjs-telegraf';
import { UuidService } from 'nestjs-uuid';
import {
  requestLinkCode,
  linkCodeNotFound,
  returnLink,
  invalidCode,
} from 'src/app.messages';
import { GET_LINK_SCENE, START_SCENE } from 'src/app.constants';
import { Context } from 'src/interfaces/context.interface';
import { UrlService } from 'src/repository/url/url.service';

@Scene(GET_LINK_SCENE)
export class GetScene {
  constructor(
    private readonly uuidService: UuidService,
    private readonly urlService: UrlService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await ctx.reply(requestLinkCode);
  }

  @On('text')
  async getLink(@Message('text') code: string, @Ctx() ctx: Context) {
    if (!this.isValidCode(code)) {
      await ctx.reply(invalidCode);
      return;
    }

    let url = await this.urlService.getOwnByCode(ctx.from.id, code);
    let isExternal = false;

    if (!url) {
      url = await this.urlService.getGlobalByCode(code);
      isExternal = !!url;
    }

    const reply = url
      ? returnLink(isExternal, url.url, url.code)
      : linkCodeNotFound;
    await ctx.replyWithHTML(reply);

    if (url) await ctx.scene.enter(START_SCENE);
  }

  private isValidCode(code: string) {
    return this.uuidService.validate(code);
  }
}
