import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VarietyEntity } from './variety.entity';
import { FieldEntity } from './filed.entity';
import { ClientEntity } from './client.entity';
import { HarvestOriginInfomation } from 'src/domain/types/harvest.types';

@Entity({
    name: 'harvests',
})
export class HarvestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => VarietyEntity, (variety) => variety.harvests)
    variety: VarietyEntity;

    @ManyToOne(() => FieldEntity, (field) => field.harvests)
    field: FieldEntity;

    @ManyToOne(() => ClientEntity, (client) => client.harvests)
    client: ClientEntity;

    @Column({ default: Date.now() })
    date: Date;

    @Column()
    origin: HarvestOriginInfomation;
}
