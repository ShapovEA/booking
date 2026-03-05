import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { disconnect, Model, Types } from 'mongoose';
import { BookingStatus, ScheduleDocument, ScheduleModel } from '../src/schedule/schedule.model';
import { CreateScheduleDto } from '../src/schedule/dto/create.schedule.dto';
import { PatchScheduleDto } from '../src/schedule/dto/patch.schedule.dto';

describe('ScheduleController (e2e)', () => {
  let app: INestApplication<App>;
  let scheduleModel: Model<ScheduleDocument>;

  const createDto: CreateScheduleDto = { roomId: new Types.ObjectId().toHexString(), date: '2025-12-25', status: BookingStatus.PENDING };
  const createFailDto = { roomId: new Types.ObjectId().toHexString(), date: 'qwerty' };;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          envFilePath: '.env.test'
        })
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    scheduleModel = moduleFixture.get(getModelToken(ScheduleModel.name))
  });

  beforeEach(async () => {
    await scheduleModel.deleteMany({});
  })

  it('/ (POST - SUCCESS)', async () => {
    return request(app.getHttpServer())
      .post('/schedule/')
      .send(createDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body._id).toBeDefined();
      });
  });

  it('/ (POST - FAIL DOUBLE_CREATE)', async () => {
    const created = await scheduleModel.create(createDto);
    return request(app.getHttpServer())
      .post('/schedule/')
      .send(createDto)
      .expect(409)
  });

  it('/ (POST - FAIL)', () => {
    return request(app.getHttpServer())
      .post('/schedule/')
      .send(createFailDto)
      .expect(400)
  });

  it('/ (GET - SUCCESS)', async () => {
    const created = await scheduleModel.create(createDto);
    const { body }: request.Response = await request(app.getHttpServer())
      .get('/schedule/')
      .expect(200)
    expect(body.length).toBe(1);
    expect(body[0]).toMatchObject({
      roomId: createDto.roomId,
      date: createDto.date
    });
    expect(body[0]._id).toBe(created.id);
  });

  it('/byId/:id (GET - SUCCESS)', async () => {
    const created = await scheduleModel.create(createDto);
    const { body }: request.Response = await request(app.getHttpServer())
      .get(`/schedule/byId/${created.id}`)
      .expect(200)
    expect(body).toMatchObject({
      roomId: createDto.roomId,
      date: createDto.date
    });
    expect(body._id).toBe(created.id);
  });

  it('/byId/:id (GET - FAILED)', async () => {
    const created = await scheduleModel.create(createDto);
    const { body }: request.Response = await request(app.getHttpServer())
      .get(`/schedule/byId/${new Types.ObjectId().toHexString()}`)
      .expect(200)
    expect(body).toBeNull;
  });

  it('/ (PATCH - SUCCESS)', async () => {
    const created = await scheduleModel.create(createDto);
    const updateDto: PatchScheduleDto = { _id: created.id, status: BookingStatus.CONFIRMED }
    const { body }: request.Response = await request(app.getHttpServer())
      .patch(`/schedule/`)
      .send(updateDto)
      .expect(200)
    expect(body.status).toBe(updateDto.status);
    expect(body._id).toBe(created.id);
  });

  it(':id (DELETE - SUCCESS)', async () => {
    const created = await scheduleModel.create(createDto);
    const { body }: request.Response = await request(app.getHttpServer())
      .delete(`/schedule/${created.id}`)
      .expect(200)

    const check = await scheduleModel.findById(created.id);
    expect(created).toBeDefined;
    expect(check).toBeNull();
  });

  it(':id (DELETE - FAILED)', async () => {
    const created = await scheduleModel.create(createDto);
    const { body }: request.Response = await request(app.getHttpServer())
      .delete(`/schedule/${new Types.ObjectId().toHexString()}`)
      .expect(200)
    expect(body).toMatchObject({})
  });

  afterAll(() => {
    disconnect();
  })
});
