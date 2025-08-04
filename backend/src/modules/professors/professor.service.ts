import { prisma } from '../../database/prisma';

export interface SearchProfessorsDto {
    instrument?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    onlineAvailable?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: 'rating' | 'price' | 'name';
    sortOrder?: 'asc' | 'desc';
}

export class ProfessorService {
    async searchProfessors(filters: SearchProfessorsDto) {
        const {
            instrument,
            minPrice,
            maxPrice,
            location,
            onlineAvailable,
            limit = 20,
            offset = 0,
            sortBy = 'rating',
            sortOrder = 'desc'
        } = filters;

        // Build where clause
        const where: any = {
            approvalStatus: 'APPROVED',
            user: {
                isActive: true,
            },
        };

        // Filter by instrument
        if (instrument) {
            where.instruments = {
                some: {
                    instrument: {
                        name: {
                            contains: instrument,
                            mode: 'insensitive',
                        },
                    },
                },
            };
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            where.baseHourlyRate = {};
            if (minPrice) where.baseHourlyRate.gte = minPrice;
            if (maxPrice) where.baseHourlyRate.lte = maxPrice;
        }

        // Filter by location
        if (location) {
            where.inPersonLocation = {
                contains: location,
                mode: 'insensitive',
            };
        }

        // Filter by online availability
        if (onlineAvailable !== undefined) {
            where.onlineAvailable = onlineAvailable;
        }

        // Build orderBy clause
        let orderBy: any = { user: { name: 'asc' } };

        switch (sortBy) {
            case 'rating':
                orderBy = { user: { name: 'asc' } };
                break;
            case 'price':
                orderBy = { baseHourlyRate: sortOrder };
                break;
            case 'name':
                orderBy = { user: { name: sortOrder } };
                break;
            default:
                orderBy = { user: { name: 'asc' } };
        }

        const professors = await prisma.professor.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImageUrl: true,
                    },
                },
                instruments: {
                    include: {
                        instrument: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
            orderBy,
            take: limit,
            skip: offset,
        });

        // Get total count for pagination
        const totalCount = professors.length;

        return {
            professors,
            pagination: {
                total: totalCount,
                limit,
                offset,
                hasMore: offset + limit < totalCount,
            },
        };
    }

    async getProfessorById(id: string) {
        const professor = await prisma.professor.findUnique({
            where: {
                id,
                approvalStatus: 'APPROVED',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImageUrl: true,
                        createdAt: true,
                    },
                },
                instruments: {
                    include: {
                        instrument: true,
                    },
                },
                pdfMaterials: {
                    where: {
                        isPublic: true,
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        category: true,
                        uploadedAt: true,
                    },
                },
                youtubeMusicLinks: {
                    orderBy: {
                        addedAt: 'desc',
                    },
                },
                certifications: {
                    orderBy: {
                        year: 'desc',
                    },
                },
                achievements: {
                    orderBy: {
                        year: 'desc',
                    },
                },
                reviews: {
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 10,
                },
                availability: true,
                premiumPlan: true,
            },
        });

        if (!professor) {
            throw new Error('Professor não encontrado');
        }

        return professor;
    }

    async getInstruments() {
        return await prisma.instrument.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }

    async getFeaturedProfessors(limit = 6) {
        return await prisma.professor.findMany({
            where: {
                approvalStatus: 'APPROVED',
                user: {
                    isActive: true,
                },
                // Prioritize premium professors
                OR: [
                    { isPremium: true },
                    { averageRating: { gte: 4.5 } },
                ],
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImageUrl: true,
                    },
                },
                instruments: {
                    include: {
                        instrument: true,
                    },
                    take: 2, // Show only first 2 instruments
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
            orderBy: [
                { isPremium: 'desc' },
                { averageRating: 'desc' },
                { totalReviews: 'desc' },
            ],
            take: limit,
        });
    }

    async updateProfessorProfile(professorId: string, data: any) {
        return await prisma.professor.update({
            where: { id: professorId },
            data: {
                biography: data.biography,
                experience: data.experience,
                methodology: data.methodology,
                baseHourlyRate: data.baseHourlyRate,
                onlineAvailable: data.onlineAvailable,
                inPersonLocation: data.inPersonLocation,
                phone: data.phone,
                whatsapp: data.whatsapp,
                youtubeUrl: data.youtubeUrl,
                instagramUrl: data.instagramUrl,
                soundcloudUrl: data.soundcloudUrl,
            },
        });
    }
}