import {
  Scene,
  SceneEnter,
  Ctx,
  On,
  Message,
  SceneLeave,
  Command,
} from 'nestjs-telegraf';
import { UuidService } from 'nestjs-uuid';
import {
  requestLink,
  requestLinkName,
  addedLinkInvalid,
  addedLinkValid,
  linkNameTooLong,
} from 'src/app.messages';
import {
  ADD_LINK_SCENE,
  BASE_DESCRIPTION_LENGTH,
  START_SCENE,
} from 'src/app.constants';
import { Context } from 'src/interfaces/context.interface';
import { UrlService } from 'src/repository/url/url.service';

@Scene(ADD_LINK_SCENE)
export class AddScene {
  private link = '';
  private description = '';

  constructor(
    private readonly urlService: UrlService,
    private readonly uuidService: UuidService,
  ) {}

  @Command(['start', 'deny', 'cancel', 'back'])
  async returnToStartScene(@Ctx() ctx: Context) {
    await ctx.scene.enter(START_SCENE);
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply(requestLink);
  }

  @On('text')
  async onText(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!this.link) {
      this.link = this.isValidUrl(message) ? message : '';

      if (!this.link) {
        await ctx.reply(addedLinkInvalid);
        return;
      }

      await ctx.reply(requestLinkName);
      return;
    }

    if (!this.description) {
      if (!this.isShortDescription(message)) {
        await ctx.reply(linkNameTooLong);
        return;
      }

      this.description = message;

      const urlData = {
        owner: String(ctx.from.id),
        url: this.link,
        description: this.description,
        code: this.uuidService.generate({ version: 4 }),
      };

      await this.urlService.create(urlData);
      await ctx.reply(addedLinkValid(urlData.code));
      await ctx.scene.enter(START_SCENE);
    }
  }

  @SceneLeave()
  async onSceneLeave() {
    this.description = '';
    this.link = '';
  }

  isValidUrl(data: string) {
    const pattern = new RegExp(
      '^([a-zA-Z]+:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i',
    );
    return pattern.test(data);
  }

  isShortDescription(data: string) {
    return data.length < BASE_DESCRIPTION_LENGTH;
  }
}
