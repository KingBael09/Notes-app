import { z } from "zod";
// import { prisma } from "../../db";
// import { RouterOutputs } from "../../../utils/api";

import {
  createTRPCRouter,
  publicProcedure,
  // privateProcedure,
} from "~/server/api/trpc";

export const notesRouter = createTRPCRouter({
  getNote: publicProcedure
    .input(z.object({ noteId: z.string() }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.prisma.notes.findUniqueOrThrow({
        where: {
          id: input.noteId,
        },
        include: {
          tags: true,
        },
      });

      return note;
    }),

  getUserNotes: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userNotes = await ctx.prisma.notes.findMany({
        where: {
          authorId: input.userId,
          archived: false,
        },
        include: {
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return userNotes;
    }),

  getUserArchive: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userNotes = await ctx.prisma.notes.findMany({
        where: {
          authorId: input.userId,
          archived: true,
        },
        include: {
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return userNotes;
    }),

  getUserPinned: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userNotes = await ctx.prisma.notes.findMany({
        where: {
          authorId: input.userId,
          pinned: true,
        },
        include: {
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return userNotes;
    }),

  createNote: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.notes.create({
        data: { ...input },
      });

      return note;
    }),

  deleteNote: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.notes.delete({
        where: {
          id: input.id,
        },
      });
      return note;
    }),

  archiveNote: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        id: z.string(),
        set: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.notes.update({
        where: {
          id: input.id,
        },
        data: {
          archived: input.set,
          pinned: false,
          priority: 0,
        },
      });

      return note;
    }),

  deleteUserArchive: publicProcedure
    .input(z.object({ authorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.notes.deleteMany({
        where: {
          archived: true,
          authorId: input.authorId,
        },
      });

      return note;
    }),

  pinNote: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        id: z.string(),
        set: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.notes.update({
        where: {
          id: input.id,
        },
        data: {
          pinned: input.set,
        },
      });

      return note;
    }),

  updateNote: publicProcedure
    .input(
      z.object({
        noteId: z.string(),
        noteData: z.object({
          title: z.string().min(1),
          content: z.string().min(1),
          pinned: z.boolean(),
          priority: z.number(),
          archived: z.boolean(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const date = new Date();
      const note = await ctx.prisma.notes.update({
        where: { id: input.noteId },
        include: { tags: true },
        data: {
          ...input.noteData,
          updatedAt: date,
        },
      });

      return note;
    }),
});
