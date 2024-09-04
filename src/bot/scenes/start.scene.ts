import {
  Scene,
  SceneEnter,
  Command,
  Ctx,
  Sender,
  Hears,
} from 'nestjs-telegraf';
import {
  ADD_LINK_SCENE,
  DELETE_LINK_SCENE,
  GET_LINK_SCENE,
  LIST_LINK_SCENE,
  START_SCENE,
} from 'src/app.constants';
import { Context } from 'src/interfaces/context.interface';
import { buttons, mainKeyboard } from 'src/app.buttons';
import { baseCallToAction, greetings } from 'src/app.messages';
import { UrlService } from 'src/repository/url/url.service';

@Scene(START_SCENE)
export class StartScene {
  constructor(private readonly urlService: UrlService) {}
  private isNotFirstEnter: boolean;

  @SceneEnter()
  async onSceneEnter(
    @Sender('first_name') firstName: string,
    @Ctx() ctx: Context,
  ) {
    if (!this.isNotFirstEnter) {
      this.isNotFirstEnter = true;
      await ctx.reply(greetings(firstName), mainKeyboard());
      return;
    }
    await ctx.reply(baseCallToAction, mainKeyboard());
  }

  @Command(['add', 'a'])
  @Hears(buttons.ADD_LINK)
  async onAdd(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(ADD_LINK_SCENE);
  }

  @Command(['list', 'all', 'links', 'urls', 'l'])
  @Hears(buttons.ALL_LINKS)
  async onShow(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(LIST_LINK_SCENE);
  }

  @Command(['get', 'g'])
  @Hears(buttons.GET_LINK)
  async onGet(@Ctx() ctx: Context) {
    await ctx.scene.enter(GET_LINK_SCENE);
  }

  @Command(['delete', 'remove', 'del', 'rem', 'd', 'r'])
  @Hears(buttons.DELETE_LINK)
  async onDelete(@Ctx() ctx: Context) {
    await ctx.scene.enter(DELETE_LINK_SCENE);
  }
}
