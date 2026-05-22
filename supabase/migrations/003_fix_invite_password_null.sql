-- Ensure invite_password is nullable
alter table teams
    alter column invite_password drop not null;
