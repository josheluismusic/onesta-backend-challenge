import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { FarmerEntity } from './farmer.entity';
import { HarvestEntity } from './harvest.entity';

@Entity({
    name: 'fields',
})
@Unique(['name', 'location'])
export class FieldEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => FarmerEntity, (farmer) => farmer.fields)
    farmer: FarmerEntity;

    @Column()
    name: string;

    @Column()
    location: string;

    @OneToMany(() => HarvestEntity, (harvest) => harvest.field)
    harvests: HarvestEntity[];
}
