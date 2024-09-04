import { Scene, SceneEnter, Ctx, Command, Action } from 'nestjs-telegraf';
import {
  BASE_PAGE_SIZE,
  LIST_LINK_SCENE,
  START_SCENE,
} from 'src/app.constants';
import { Context } from 'src/interfaces/context.interface';
import { UrlEntity } from 'src/repository/entities/url.entity';
import { UrlService } from 'src/repository/url/url.service';
import { pageButtons } from 'src/app.buttons';

interface IPagination {
  items: UrlEntity[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

@Scene(LIST_LINK_SCENE)
export class ListScene {
  private page = 1;
  private pageSize = BASE_PAGE_SIZE;

  constructor(private readonly urlService: UrlService) {}

  @Command(['start', 'deny', 'cancel', 'back'])
  async returnToStartScene(@Ctx() ctx: Context) {
    await ctx.scene.enter(START_SCENE);
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const { items, currentPage, totalPages } = await this.paginate(
      ctx.from.id,
      this.page,
      this.pageSize,
    );

    await ctx.reply(
      `Доступные ссылки (${currentPage}/${totalPages}):\n\n${items
        .map((i) => `${i.description} - ${i.code}\n\n`)
        .join('')}\n\nДля выхода введи команду /cancel`,
      pageButtons({
        left: currentPage != 1,
        right: currentPage < totalPages,
      }),
    );
  }

  @Action(/left/)
  async decrementPage(@Ctx() ctx: Context) {
    this.page -= 1;
    await ctx.answerCbQuery();
    await ctx.scene.reenter();
  }

  @Action(/right/)
  async incrementPage(@Ctx() ctx: Context) {
    this.page += 1;
    await ctx.answerCbQuery();
    await ctx.scene.reenter();
  }

  private async paginate(
    owner: number,
    page: number,
    pageSize: number,
  ): Promise<IPagination> {
    const items = await this.urlService.getAll(owner);
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentPage = page > totalPages ? totalPages : page;

    const paginatedItems = items.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );

    return {
      items: paginatedItems,
      totalItems,
      totalPages,
      currentPage,
    };
  }
}
