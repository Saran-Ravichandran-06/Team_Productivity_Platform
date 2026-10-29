import { describe, it, expect, vi } from 'vitest';
import { ProjectRole } from '@prisma/client';
import * as permissions from './permissions';
import { prisma } from './prisma';
import * as session from './session';

// Mock the modules
vi.mock('./prisma', () => ({
  prisma: {
    projectMember: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('./session', () => ({
  getCurrentUser: vi.fn(),
}));

describe('Permissions', () => {
  describe('Role Helpers', () => {
    it('isProjectOwner should return true only for OWNER', () => {
      expect(permissions.isProjectOwner(ProjectRole.OWNER)).toBe(true);
      expect(permissions.isProjectOwner(ProjectRole.ADMIN)).toBe(false);
      expect(permissions.isProjectOwner(ProjectRole.MEMBER)).toBe(false);
    });

    it('isProjectAdmin should return true for OWNER and ADMIN', () => {
      expect(permissions.isProjectAdmin(ProjectRole.OWNER)).toBe(true);
      expect(permissions.isProjectAdmin(ProjectRole.ADMIN)).toBe(true);
      expect(permissions.isProjectAdmin(ProjectRole.MEMBER)).toBe(false);
    });
  });

  describe('Feature Helpers', () => {
    it('canManageProject should return true only for OWNER', () => {
      expect(permissions.canManageProject(ProjectRole.OWNER)).toBe(true);
      expect(permissions.canManageProject(ProjectRole.ADMIN)).toBe(false);
      expect(permissions.canManageProject(ProjectRole.MEMBER)).toBe(false);
    });

    it('canEditProject should return true for ADMIN and OWNER', () => {
      expect(permissions.canEditProject(ProjectRole.OWNER)).toBe(true);
      expect(permissions.canEditProject(ProjectRole.ADMIN)).toBe(true);
      expect(permissions.canEditProject(ProjectRole.MEMBER)).toBe(false);
    });

    it('canUpdateTask should allow ADMINs to update any task', () => {
      expect(permissions.canUpdateTask(ProjectRole.ADMIN, 'user1', 'user2', 'user3')).toBe(true);
      expect(permissions.canUpdateTask(ProjectRole.OWNER, 'user1', 'user2', 'user3')).toBe(true);
    });

    it('canUpdateTask should allow MEMBER to update if they are creator or assignee', () => {
      // Creator
      expect(permissions.canUpdateTask(ProjectRole.MEMBER, 'user1', 'user1', 'user2')).toBe(true);
      // Assignee
      expect(permissions.canUpdateTask(ProjectRole.MEMBER, 'user2', 'user1', 'user2')).toBe(true);
      // Neither
      expect(permissions.canUpdateTask(ProjectRole.MEMBER, 'user3', 'user1', 'user2')).toBe(false);
    });

    it('canDeleteTask should allow ADMINs to delete any task', () => {
      expect(permissions.canDeleteTask(ProjectRole.ADMIN, 'user1', 'user2')).toBe(true);
      expect(permissions.canDeleteTask(ProjectRole.OWNER, 'user1', 'user2')).toBe(true);
    });

    it('canDeleteTask should allow MEMBER to delete ONLY if they are creator', () => {
      expect(permissions.canDeleteTask(ProjectRole.MEMBER, 'user1', 'user1')).toBe(true);
      expect(permissions.canDeleteTask(ProjectRole.MEMBER, 'user2', 'user1')).toBe(false);
    });
    
    it('canEditComment should allow ADMINs to edit any comment', () => {
      expect(permissions.canEditComment(ProjectRole.ADMIN, 'user1', 'user2')).toBe(true);
    });
    
    it('canEditComment should allow MEMBER to edit only their own comment', () => {
      expect(permissions.canEditComment(ProjectRole.MEMBER, 'user1', 'user1')).toBe(true);
      expect(permissions.canEditComment(ProjectRole.MEMBER, 'user1', 'user2')).toBe(false);
    });
  });

  describe('getProjectMembership', () => {
    it('should query prisma with correct arguments', async () => {
      const mockFindUnique = vi.mocked(prisma.projectMember.findUnique).mockResolvedValue({
        id: '1', projectId: 'p1', userId: 'u1', role: ProjectRole.MEMBER, joinedAt: new Date()
      });

      const res = await permissions.getProjectMembership('u1', 'p1');
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { projectId_userId: { projectId: 'p1', userId: 'u1' } }
      });
      expect(res?.role).toBe(ProjectRole.MEMBER);
    });
  });

  describe('requireProjectMember', () => {
    it('should throw Unauthorized if no user', async () => {
      vi.mocked(session.getCurrentUser).mockResolvedValue(null);
      await expect(permissions.requireProjectMember('p1')).rejects.toThrow('Unauthorized');
    });

    it('should throw Forbidden if user is not a member', async () => {
      vi.mocked(session.getCurrentUser).mockResolvedValue({ id: 'u1', name: 'User', email: 'u@e.com' });
      vi.mocked(prisma.projectMember.findUnique).mockResolvedValue(null);

      await expect(permissions.requireProjectMember('p1')).rejects.toThrow('Forbidden: Not a member of this project');
    });

    it('should return user and membership if authorized', async () => {
      const mockUser = { id: 'u1', name: 'User', email: 'u@e.com' };
      const mockMembership = { id: 'm1', projectId: 'p1', userId: 'u1', role: ProjectRole.MEMBER, joinedAt: new Date() };
      
      vi.mocked(session.getCurrentUser).mockResolvedValue(mockUser);
      vi.mocked(prisma.projectMember.findUnique).mockResolvedValue(mockMembership);

      const result = await permissions.requireProjectMember('p1');
      expect(result.user).toEqual(mockUser);
      expect(result.membership).toEqual(mockMembership);
    });
  });
});
