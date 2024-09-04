import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'src/interfaces/context.interface';
import { START_SCENE } from 'src/app.constants';

@Update()
export class BotUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.scene.enter(START_SCENE);
  }

  @On('text')
  async textBaseHandler(@Ctx() ctx: Context) {
    await this.onStart(ctx);
  }

  @On('audio')
  async audioBaseHandler(@Ctx() ctx: Context) {
    await this.onStart(ctx);
  }

  @On('photo')
  async photoBaseHandler(@Ctx() ctx: Context) {
    await this.onStart(ctx);
  }
}
