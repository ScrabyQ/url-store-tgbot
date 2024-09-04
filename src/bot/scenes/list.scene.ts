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
  private urls: UrlEntity[];

  constructor(private readonly urlService: UrlService) {}

  @Command(['start', 'deny', 'cancel', 'back'])
  async returnToStartScene(@Ctx() ctx: Context) {
    await ctx.scene.enter(START_SCENE);
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    if (!this.urls) {
      this.urls = await this.urlService.getAll(ctx.from.id);
    }

    const { items, currentPage, totalPages } = this.paginate(
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

  private paginate(page: number, pageSize: number): IPagination {
    const totalItems = this.urls.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentPage = page > totalPages ? totalPages : page;

    const paginatedItems = this.urls.slice(
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
