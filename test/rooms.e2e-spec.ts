import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { RoomsDocument, RoomsModel, RoomType } from '../src/rooms/rooms.model';
import { disconnect, Model, Types } from 'mongoose';
import { CreateRoomDto } from '../src/rooms/dto/create.room.dto';
import { UpdateRoomDto } from 'src/rooms/dto/update.room.dto';

describe('RoomsController (e2e)', () => {
  let app: INestApplication<App>;
  let roomsModel: Model<RoomsDocument>;

  const createDto: CreateRoomDto = { number: 1, type: RoomType.STANDART, hasSV: true };
  const createFailDto = { number: 1, type: "randomType" };

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

    roomsModel = moduleFixture.get(getModelToken(RoomsModel.name))
  });

  beforeEach(async () => {
    await roomsModel.deleteMany({});
  })

  it('/ (POST - SUCCESS)', async () => {
    return request(app.getHttpServer())
      .post('/rooms/')
      .send(createDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body._id).toBeDefined();
      });
  });

  it('/ (POST - FAIL)', () => {
    return request(app.getHttpServer())
      .post('/rooms/')
      .send(createFailDto)
      .expect(400)
  });

  it('/ (GET - SUCCESS)', async () => {
    const created = await roomsModel.create(createDto);
    const { body }: request.Response = await request(app.getHttpServer())
      .get('/rooms/')
      .expect(200)
    expect(body.length).toBe(1);
    expect(body[0]).toMatchObject({
      number: createDto.number,
      type: createDto.type,
      hasSV: createDto.hasSV
    });
    expect(body[0]._id).toBe(created.id);
  });

  it('/byId/:id (GET - SUCCESS)', async () => {
    const created = await roomsModel.create(createDto);
    const { body }: request.Response = await request(app.getHttpServer())
      .get(`/rooms/byId/${created.id}`)
      .expect(200)
    expect(body).toMatchObject({
      number: createDto.number,
      type: createDto.type,
      hasSV: createDto.hasSV
    });
    expect(body._id).toBe(created.id);
  });

  it('/byId/:id (GET - FAILED)', async () => {
    const created = await roomsModel.create(createDto);
    const { body }: request.Response = await request(app.getHttpServer())
      .get(`/rooms/byId/${new Types.ObjectId().toHexString()}`)
      .expect(200)
    expect(body).toBeNull;
  });

  it('/ (PATCH - SUCCESS)', async () => {
    const created = await roomsModel.create(createDto);
    const updateDto: UpdateRoomDto = { _id: created.id, number: 2 }
    const { body }: request.Response = await request(app.getHttpServer())
      .patch(`/rooms/`)
      .send(updateDto)
      .expect(200)
    expect(body.number).toBe(updateDto.number);
    expect(body._id).toBe(created.id);
  });

  it('/byId/:roomId (DELETE - SUCCESS)', async () => {
    const created = await roomsModel.create(createDto);
    const { body }: request.Response = await request(app.getHttpServer())
      .delete(`/rooms/byId/${created.id}`)
      .expect(200)

    const check = await roomsModel.findById(created.id);
    expect(created).toBeDefined;
    expect(check).toBeNull();
  });

  it('/byId/:roomId (DELETE - FAILED)', async () => {
    const created = await roomsModel.create(createDto);
    const { body }: request.Response = await request(app.getHttpServer())
      .delete(`/rooms/byId/${new Types.ObjectId().toHexString()}`)
      .expect(200)
    expect(body).toMatchObject({})
  });

  afterAll(() => {
    disconnect();
  })
});
