using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

public class HandmanContext : DbContext
{
    public DbSet<Word> Words { get; set; }
    public DbSet<Score> Scores { get; set; }
    public string DbPath { get; }

    public HandmanContext()
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = System.IO.Path.Join(path, "Handman.db");
    }

    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
}

